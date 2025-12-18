import { PurchaseInvoice, Party, PurchaseOrder, PurchaseInvoiceItem, sequelize, Account, ReferenceType } from "../models/index.js";
import { Op } from "sequelize";

class PurchaseInvoiceService {
  static async getAll(purchaseOrderId = null) {
    const where = {};
    if (purchaseOrderId) {
      where.purchase_order_id = purchaseOrderId;
    }

    return await PurchaseInvoice.findAll({
      where,
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
      order: [["id", "DESC"]],
    });
  }

  static async getById(id) {
    return await PurchaseInvoice.findByPk(id, {
      include: [
        { model: Party, as: "supplier", attributes: ["id", "name"] },
        { model: PurchaseOrder, as: "purchase_order", attributes: ["id", "order_number"] },
      ],
    });
  }

  static async create(data, options = {}) {
    const transaction = options.transaction || await sequelize.transaction();
    try {
      const { items, ...invoiceData } = data;

      // Auto-generate invoice_number if not provided
      if (!invoiceData.invoice_number) {
        const year = new Date().getFullYear();
        const lastInvoice = await PurchaseInvoice.findOne({
          where: {
            invoice_number: {
              [Op.like]: `PI-${year}-%`
            }
          },
          order: [['id', 'DESC']],
          transaction
        });

        let nextNumber = 1;
        if (lastInvoice) {
          const lastNumber = parseInt(lastInvoice.invoice_number.split('-')[2]);
          nextNumber = lastNumber + 1;
        }

        invoiceData.invoice_number = `PI-${year}-${String(nextNumber).padStart(6, '0')}`;
      }

      const invoice = await PurchaseInvoice.create(invoiceData, { transaction });

      // Create items if they exist
      if (items && items.length > 0) {
        const itemsWithInvoiceId = items.map(item => ({
          ...item,
          purchase_invoice_id: invoice.id
        }));

        await PurchaseInvoiceItem.bulkCreate(itemsWithInvoiceId, { transaction });

        // Create Inventory Transactions (IN)
        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;

        for (const item of itemsWithInvoiceId) {
          // 1. Transaction for Main Quantity
          if (Number(item.quantity) > 0) {
            const batches = [];
            if (item.batch_number && item.expiry_date) {
              batches.push({
                batch_number: item.batch_number,
                expiry_date: item.expiry_date,
                quantity: item.quantity,
                cost_per_unit: Number(item.unit_price)
              });
            } else {
              batches.push({
                batch_number: null,
                expiry_date: null,
                quantity: item.quantity,
                cost_per_unit: Number(item.unit_price)
              });
            }

            await InventoryTransactionService.create({
              product_id: item.product_id,
              warehouse_id: item.warehouse_id || invoice.warehouse_id,
              transaction_type: 'in',
              transaction_date: invoice.invoice_date || new Date(),
              note: `Purchase Invoice #${invoice.invoice_number || invoice.id}`,
              source_type: 'purchase',
              source_id: item.id,
              batches: batches
            }, { transaction });
          }

          // 2. Transaction for Bonus
          if (Number(item.bonus_quantity) > 0) {
            const bonusBatches = [];
            if (item.batch_number && item.expiry_date) {
              bonusBatches.push({
                batch_number: item.batch_number,
                expiry_date: item.expiry_date,
                quantity: item.bonus_quantity,
                cost_per_unit: 0
              });
            } else {
              bonusBatches.push({
                batch_number: null,
                expiry_date: null,
                quantity: item.bonus_quantity,
                cost_per_unit: 0
              });
            }

            await InventoryTransactionService.create({
              product_id: item.product_id,
              warehouse_id: item.warehouse_id || invoice.warehouse_id,
              transaction_type: 'in',
              transaction_date: invoice.invoice_date || new Date(),
              note: `Purchase Invoice #${invoice.invoice_number || invoice.id} (Bonus)`,
              source_type: 'purchase',
              source_id: item.id,
              batches: bonusBatches
            }, { transaction });
          }
        }
      }

      // --- Journal Entry Creation ---
      const { createJournalEntry } = await import('./journal.service.js');

      // Resolve Accounts
      const inventoryAccount = await Account.findOne({ where: { name: 'المخزون' }, transaction });

      // VAT: Try specific "ضريبة القيمه المضافه" (ID 65 specific) or standard.
      let vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمه المضافه' }, transaction });
      if (!vatAccount) vatAccount = await Account.findOne({ where: { name: 'ضريبة القيمة المضافة' }, transaction });

      const supplierAccount = await Account.findOne({ where: { name: 'الموردين' }, transaction });
      const discountAccount = await Account.findOne({ where: { name: 'خصم مكتسب' }, transaction });
      const taxAccount = await Account.findOne({ where: { name: 'خصم و اضافه ضرائب مشتريات' }, transaction });

      console.log('JE Debug: PI Accounts Resolved', {
        inventory: !!inventoryAccount,
        vat: !!vatAccount,
        supplier: !!supplierAccount
      });

      // Check for ReferenceType
      let refType = await ReferenceType.findOne({ where: { code: 'purchase_invoice' }, transaction });
      if (!refType) {
        refType = await ReferenceType.create({
          code: 'purchase_invoice',
          label: 'فاتورة شراء',
          name: 'فاتورة شراء',
          description: 'Journal Entry for Purchase Invoice'
        }, { transaction });
      }

      if (inventoryAccount && supplierAccount) {
        const lines = [];

        // 1. Dr Inventory (Subtotal)
        if (Number(invoice.subtotal) > 0) {
          lines.push({
            account_id: inventoryAccount.id,
            debit: invoice.subtotal,
            credit: 0,
            description: `Inventory - PI #${invoice.invoice_number}`
          });
        }

        // 2. Dr VAT
        if (Number(invoice.vat_amount) > 0) {
          if (vatAccount) {
            lines.push({
              account_id: vatAccount.id,
              debit: invoice.vat_amount,
              credit: 0,
              description: `VAT - PI #${invoice.invoice_number}`
            });
          } else {
            console.warn('JE Warning: VAT > 0 but Account MISSING');
          }
        }

        // 3. Cr Discount (Additional Discount)
        if (Number(invoice.additional_discount) > 0) {
          if (discountAccount) {
            lines.push({
              account_id: discountAccount.id,
              debit: 0,
              credit: invoice.additional_discount,
              description: `Discount Received - PI #${invoice.invoice_number}`
            });
          } else {
            console.warn('JE Warning: Discount > 0 but Account MISSING');
          }
        }

        // 4. Cr Withholding Tax
        if (Number(invoice.tax_amount) > 0) {
          if (taxAccount) {
            lines.push({
              account_id: taxAccount.id,
              debit: 0,
              credit: invoice.tax_amount,
              description: `WHT - PI #${invoice.invoice_number}`
            });
          } else {
            console.warn('JE Warning: TaxAmount > 0 but Account MISSING');
          }
        }

        // 5. Cr Supplier (Total Payable)
        if (Number(invoice.total_amount) > 0) {
          lines.push({
            account_id: supplierAccount.id,
            debit: 0,
            credit: invoice.total_amount,
            description: `Supplier - PI #${invoice.invoice_number}`
          });
        }

        if (lines.length > 0) {
          try {
            await createJournalEntry({
              refCode: 'purchase_invoice',
              refId: invoice.id,
              entryDate: invoice.invoice_date,
              description: `Purchase Invoice #${invoice.invoice_number}`,
              lines: lines,
              entryTypeId: 1
            }, { transaction });
            console.log('JE Success: PI Entry Created');
          } catch (err) {
            console.error('JE Error: PI Entry Failed', err);
          }
        }
      } else {
        console.error('JE Error: PI Entry Skipped. Missing Essential Accounts:', {
          inventory: !!inventoryAccount ? inventoryAccount.name : 'MISSING',
          supplier: !!supplierAccount ? supplierAccount.name : 'MISSING'
        });
      }

      if (!options.transaction) await transaction.commit();
      return invoice;
    } catch (error) {
      if (!options.transaction) await transaction.rollback();
      throw error;
    }
  }

  static async update(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const invoice = await PurchaseInvoice.findByPk(id, { transaction });
      if (!invoice) {
        await transaction.rollback();
        throw new Error("PurchaseInvoice not found");
      }

      const { items, ...invoiceData } = data;

      // Update invoice details
      await invoice.update(invoiceData, { transaction });

      // If items are provided, replace them
      if (items !== undefined) {
        // 1. Reverse old inventory transactions
        const oldItems = await PurchaseInvoiceItem.findAll({ where: { purchase_invoice_id: id }, transaction });

        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;
        const { InventoryTransaction } = await import('../models/index.js');

        for (const oldItem of oldItems) {
          const oldTrx = await InventoryTransaction.findOne({
            where: { source_type: 'purchase', source_id: oldItem.id },
            transaction
          });
          if (oldTrx) {
            await InventoryTransactionService.remove(oldTrx.id, { transaction });
          }
        }

        // 2. Delete old items
        await PurchaseInvoiceItem.destroy({ where: { purchase_invoice_id: id }, transaction });

        // 3. Create new items
        if (items.length > 0) {
          const itemsWithInvoiceId = items.map(item => ({
            ...item,
            purchase_invoice_id: id
          }));

          for (const itemData of itemsWithInvoiceId) {
            const newItem = await PurchaseInvoiceItem.create(itemData, { transaction });

            // 4. Create new inventory transactions
            if (Number(newItem.quantity) > 0) {
              const batches = newItem.batch_number && newItem.expiry_date ?
                [{ batch_number: newItem.batch_number, expiry_date: newItem.expiry_date, quantity: newItem.quantity, cost_per_unit: Number(newItem.unit_price) }] :
                [{ batch_number: null, expiry_date: null, quantity: newItem.quantity, cost_per_unit: Number(newItem.unit_price) }];

              await InventoryTransactionService.create({
                product_id: newItem.product_id,
                warehouse_id: newItem.warehouse_id || invoice.warehouse_id,
                transaction_type: 'in',
                transaction_date: invoice.invoice_date || new Date(),
                note: `Purchase Invoice #${invoice.invoice_number || invoice.id}`,
                source_type: 'purchase',
                source_id: newItem.id,
                batches: batches
              }, { transaction });
            }

            if (Number(newItem.bonus_quantity) > 0) {
              const bonusBatches = newItem.batch_number && newItem.expiry_date ?
                [{ batch_number: newItem.batch_number, expiry_date: newItem.expiry_date, quantity: newItem.bonus_quantity, cost_per_unit: 0 }] :
                [{ batch_number: null, expiry_date: null, quantity: newItem.bonus_quantity, cost_per_unit: 0 }];

              await InventoryTransactionService.create({
                product_id: newItem.product_id,
                warehouse_id: newItem.warehouse_id || invoice.warehouse_id,
                transaction_type: 'in',
                transaction_date: invoice.invoice_date || new Date(),
                note: `Purchase Invoice #${invoice.invoice_number || invoice.id} (Bonus)`,
                source_type: 'purchase',
                source_id: newItem.id,
                batches: bonusBatches
              }, { transaction });
            }
          }
        }
      }

      await transaction.commit();
      return invoice;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async delete(id) {
    const invoice = await PurchaseInvoice.findByPk(id);
    if (!invoice) throw new Error("PurchaseInvoice not found");
    return await invoice.destroy();
  }
}

export default PurchaseInvoiceService;
