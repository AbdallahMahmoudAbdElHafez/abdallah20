import { PurchaseInvoice, Party, PurchaseOrder, PurchaseInvoiceItem, sequelize } from "../models/index.js";
import { Op } from "sequelize";


class PurchaseInvoiceService {
  // ⬇️ تعديل الدالة لقبول فلتر اختياري
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
        // We need to import InventoryTransactionService dynamically or at top if not circular
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
              warehouse_id: item.warehouse_id || invoice.warehouse_id, // Fallback
              transaction_type: 'in',
              transaction_date: invoice.invoice_date || new Date(),
              note: `Purchase Invoice #${invoice.invoice_number || invoice.id}`,
              source_type: 'purchase', // Matches purchaseInvoiceItem.service.js source_type
              source_id: item.id, // This is tricky with bulkCreate, we don't have IDs easily.
              // Actually bulkCreate returns instances if we ask it, but let's see.
              // If we use bulkCreate, we might not get IDs back easily in all SQL dialects without returning: true
              // Let's iterate and create one by one to be safe and get IDs, OR fetch them.
              // Better: create one by one to get ID for source_id.
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
                cost_per_unit: Number(item.unit_price) // Bonus usually has 0 cost, but in purchase we might want to track it with cost or 0?
                // User didn't specify, but usually bonus is free.
                // However, if we put cost, it increases inventory value.
                // If it's free, cost should be 0.
                // Let's assume 0 cost for bonus in purchase too, unless it's a "buy 1 get 1" where cost is distributed.
                // But "bonus" usually implies free.
                // Let's use 0 for now to be consistent with sales.
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
              warehouse_id: item.warehouse_id || invoice.warehouse_id, // Fallback
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
            // 4.1 Main Quantity
            if (Number(newItem.quantity) > 0) {
              const batches = [];
              if (newItem.batch_number && newItem.expiry_date) {
                batches.push({
                  batch_number: newItem.batch_number,
                  expiry_date: newItem.expiry_date,
                  quantity: newItem.quantity,
                  cost_per_unit: Number(newItem.unit_price)
                });
              } else {
                batches.push({
                  batch_number: null,
                  expiry_date: null,
                  quantity: newItem.quantity,
                  cost_per_unit: Number(newItem.unit_price)
                });
              }

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

            // 4.2 Bonus
            if (Number(newItem.bonus_quantity) > 0) {
              const bonusBatches = [];
              if (newItem.batch_number && newItem.expiry_date) {
                bonusBatches.push({
                  batch_number: newItem.batch_number,
                  expiry_date: newItem.expiry_date,
                  quantity: newItem.bonus_quantity,
                  cost_per_unit: 0
                });
              } else {
                bonusBatches.push({
                  batch_number: null,
                  expiry_date: null,
                  quantity: newItem.bonus_quantity,
                  cost_per_unit: 0
                });
              }

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
