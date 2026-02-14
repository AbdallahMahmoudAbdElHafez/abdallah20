import {
  IssueVoucher,
  IssueVoucherItem,
  Product,
  Warehouse,
  Party,
  Employee,
  sequelize,
  Account,
  ReferenceType,
  Doctor,
  EntryType,
  Unit
} from '../models/index.js';
import { Op } from 'sequelize';
import { ENTRY_TYPES } from '../constants/entryTypes.js';

export class IssueVouchersService {

  async createIssueVoucher(voucherData) {
    try {
      const voucher = await IssueVoucher.create(voucherData);
      return await this.getIssueVoucherById(voucher.id, true);
    } catch (error) {
      throw new Error(`Error creating issue voucher: ${error.message}`);
    }
  }

  async createIssueVoucherWithItems(voucherData, itemsData = []) {
    const transaction = await sequelize.transaction();
    try {
      const voucher = await IssueVoucher.create(voucherData, { transaction });

      if (itemsData.length > 0) {
        const itemsWithVoucherId = itemsData.map(item => ({
          ...item,
          voucher_id: voucher.id
        }));

        const createdItems = await IssueVoucherItem.bulkCreate(itemsWithVoucherId, { transaction });

        // Import InventoryTransactionService
        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;

        // Create Inventory Transactions (OUT) using FIFO batches
        const FIFOCostService = (await import('./fifoCost.service.js')).default;
        const itemsForCost = createdItems.map(item => ({
          product_id: item.product_id,
          warehouse_id: voucher.warehouse_id,
          quantity: Number(item.quantity)
        }));

        let fifoBatchesMap = new Map();
        try {
          const { itemCosts } = await FIFOCostService.calculateFIFOCostForItems(itemsForCost, transaction);
          for (const itemCost of itemCosts) {
            const createdItem = createdItems.find(ci => ci.product_id === itemCost.product_id);
            if (createdItem) {
              fifoBatchesMap.set(createdItem.id, itemCost.batches);
            }
          }
        } catch (error) {
          console.error('Issue Voucher: FIFO batch calculation failed:', error.message);
        }

        // Create inventory OUT transactions using FIFO batches
        for (const item of createdItems) {
          if (Number(item.quantity) > 0) {
            const fifoBatches = fifoBatchesMap.get(item.id);

            if (fifoBatches && fifoBatches.length > 0) {
              for (const fifoBatch of fifoBatches) {
                await InventoryTransactionService.create({
                  product_id: item.product_id,
                  warehouse_id: voucher.warehouse_id,
                  transaction_type: 'out',
                  transaction_date: voucher.issue_date,
                  note: `Issue Voucher #${voucher.voucher_no}`,
                  source_type: 'issue_voucher',
                  source_id: item.id,
                  batches: [{
                    batch_id: fifoBatch.batchId,
                    quantity: fifoBatch.quantity,
                    cost_per_unit: fifoBatch.costPerUnit
                  }]
                }, { transaction });
              }
            } else {
              await InventoryTransactionService.create({
                product_id: item.product_id,
                warehouse_id: voucher.warehouse_id,
                transaction_type: 'out',
                transaction_date: voucher.issue_date,
                note: `Issue Voucher #${voucher.voucher_no}`,
                source_type: 'issue_voucher',
                source_id: item.id,
                batches: [{
                  batch_id: null,
                  quantity: Number(item.quantity),
                  cost_per_unit: 0
                }]
              }, { transaction });
            }
          }
        }
      }

      // --- Journal Entry Creation ---
      await this._syncJournalEntry(voucher.id, itemsData, transaction);

      await transaction.commit();
      return await this.getIssueVoucherById(voucher.id, true);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw new Error(`Error creating issue voucher with items: ${error.message}`);
    }
  }

  async getAllIssueVouchers(filters = {}) {
    try {
      const whereClause = {};

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.warehouse_id) {
        whereClause.warehouse_id = filters.warehouse_id;
      }

      if (filters.start_date && filters.end_date) {
        whereClause.issue_date = {
          [Op.between]: [filters.start_date, filters.end_date]
        };
      }

      const vouchers = await IssueVoucher.findAll({
        where: whereClause,
        include: [
          {
            model: Party,
            as: 'party',
            attributes: ['id', 'name']
          },
          {
            model: Warehouse,
            as: 'warehouse',
            attributes: ['id', 'name']
          },
          {
            model: Employee,
            as: 'responsible_employee',
            attributes: ['id', 'name']
          },
          {
            model: Doctor,
            as: 'doctor',
            attributes: ['id', 'name']
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return vouchers;
    } catch (error) {
      throw new Error(`Error fetching issue vouchers: ${error.message}`);
    }
  }

  async getIssueVoucherById(id, includeItems = false) {
    try {
      const include = [
        {
          model: Party,
          as: 'party',
          attributes: ['id', 'name']
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'responsible_employee',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'issuer',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'approver',
          attributes: ['id', 'name']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name']
        }
      ];

      if (includeItems) {
        include.push({
          model: IssueVoucherItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'cost_price', 'price'],
              include: [
                {
                  model: Unit,
                  as: 'unit',
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        });
      }

      const voucher = await IssueVoucher.findByPk(id, { include });

      if (!voucher) {
        throw new Error('Issue voucher not found');
      }

      return voucher;
    } catch (error) {
      throw new Error(`Error fetching issue voucher: ${error.message}`);
    }
  }

  async getIssueVoucherByVoucherNo(voucherNo, includeItems = false) {
    try {
      const include = [
        {
          model: Party,
          as: 'party',
          attributes: ['id', 'name']
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name']
        },
        {
          model: Employee,
          as: 'responsible_employee',
          attributes: ['id', 'name']
        },
        {
          model: Doctor,
          as: 'doctor',
          attributes: ['id', 'name']
        }
      ];

      if (includeItems) {
        include.push({
          model: IssueVoucherItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'cost_price', 'price']
            }
          ]
        });
      }

      const voucher = await IssueVoucher.findOne({
        where: { voucher_no: voucherNo },
        include
      });

      if (!voucher) {
        throw new Error('Issue voucher not found');
      }

      return voucher;
    } catch (error) {
      throw new Error(`Error fetching issue voucher: ${error.message}`);
    }
  }

  async updateIssueVoucher(id, updateData) {
    try {
      const voucher = await IssueVoucher.findByPk(id);
      if (!voucher) {
        throw new Error('Issue voucher not found');
      }

      await voucher.update(updateData);
      return await this.getIssueVoucherById(id, true);
    } catch (error) {
      throw new Error(`Error updating issue voucher: ${error.message}`);
    }
  }

  async updateIssueVoucherWithItems(id, updateData, itemsData = []) {
    const transaction = await sequelize.transaction();
    try {
      const voucher = await IssueVoucher.findByPk(id, { transaction });
      if (!voucher) {
        throw new Error('Issue voucher not found');
      }

      await voucher.update(updateData, { transaction });

      await IssueVoucherItem.destroy({
        where: { voucher_id: id },
        transaction
      });

      if (itemsData.length > 0) {
        const itemsWithVoucherId = itemsData.map(item => ({
          ...item,
          voucher_id: id
        }));

        await IssueVoucherItem.bulkCreate(itemsWithVoucherId, { transaction });
      }

      // --- Journal Entry Update ---
      await this._syncJournalEntry(id, itemsData, transaction);

      await transaction.commit();
      return await this.getIssueVoucherById(id, true);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw new Error(`Error updating issue voucher with items: ${error.message}`);
    }
  }

  async deleteIssueVoucher(id) {
    try {
      const voucher = await IssueVoucher.findByPk(id);
      if (!voucher) {
        throw new Error('Issue voucher not found');
      }

      await voucher.destroy();
      return { message: 'Issue voucher deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting issue voucher: ${error.message}`);
    }
  }

  async updateVoucherStatus(id, status, approvedBy = null) {
    try {
      const updateData = { status };

      if (status === 'approved' && approvedBy) {
        updateData.approved_by = approvedBy;
      }

      const voucher = await this.updateIssueVoucher(id, updateData);
      return voucher;
    } catch (error) {
      throw new Error(`Error updating voucher status: ${error.message}`);
    }
  }

  async isVoucherNoUnique(voucherNo, excludeId = null) {
    try {
      const whereClause = { voucher_no: voucherNo };

      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      const existingVoucher = await IssueVoucher.findOne({ where: whereClause });
      return !existingVoucher;
    } catch (error) {
      throw new Error(`Error checking voucher number: ${error.message}`);
    }
  }

  async getVoucherTotals(id) {
    try {
      const voucher = await this.getIssueVoucherById(id, true);

      if (!voucher.items || voucher.items.length === 0) {
        return {
          totalQuantity: 0,
          totalCost: 0,
          itemsCount: 0
        };
      }

      const totals = voucher.items.reduce((acc, item) => {
        const quantity = parseFloat(item.quantity);
        const costPerUnit = parseFloat(item.cost_per_unit || 0);

        acc.totalQuantity += quantity;
        acc.totalCost += quantity * costPerUnit;
        acc.itemsCount += 1;

        return acc;
      }, {
        totalQuantity: 0,
        totalCost: 0,
        itemsCount: 0
      });

      return totals;
    } catch (error) {
      throw new Error(`Error calculating voucher totals: ${error.message}`);
    }
  }

  async checkInventoryAvailability(items) {
    try {
      const availability = {
        available: true,
        details: items.map(item => ({
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          required_quantity: item.quantity,
          available_quantity: 1000,
          is_available: true
        }))
      };

      return availability;
    } catch (error) {
      throw new Error(`Error checking inventory availability: ${error.message}`);
    }
  }

  /**
   * Sync Journal Entry for Issue Voucher
   */
  async _syncJournalEntry(voucherId, itemsData, transaction) {
    try {
      const { createJournalEntry } = await import('./journal.service.js');
      const { JournalEntry } = await import('../models/index.js');

      const voucher = await IssueVoucher.findByPk(voucherId, { transaction });
      if (!voucher) return;

      // 1. Delete existing entry if any
      let refType = await ReferenceType.findOne({ where: { code: 'issue_voucher' }, transaction });
      if (!refType) {
        refType = await ReferenceType.create({
          code: 'issue_voucher',
          label: 'سند صرف مخزني',
          name: 'سند صرف مخزني',
          description: 'Journal Entry for Issue Voucher'
        }, { transaction });
      }

      await JournalEntry.destroy({
        where: { reference_type_id: refType.id, reference_id: voucher.id },
        transaction
      });

      if (!itemsData || itemsData.length === 0) return;

      // 2. Resolve Accounts
      const INVENTORY_ACCOUNTS = {
        FINISHED_GOODS: 110,    // مخزون تام الصنع
        RAW_MATERIALS: 111,     // مخزون أولي
        DEFAULT: 49             // المخزون
      };

      const PRODUCT_TYPE_TO_ACCOUNT = {
        1: INVENTORY_ACCOUNTS.FINISHED_GOODS,
        2: INVENTORY_ACCOUNTS.RAW_MATERIALS
      };

      const debitAccount = await Account.findByPk(voucher.account_id, { transaction });
      if (!debitAccount && voucher.issue_type !== 'replacement') {
        console.warn(`Issue Voucher: Debit account not found for ID ${voucher.account_id}`);
        return;
      }

      // 3. Calculate Costs
      const FIFOCostService = (await import('./fifoCost.service.js')).default;
      const productIds = itemsData.map(i => i.product_id);
      const products = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        attributes: ['id', 'name', 'cost_price', 'price', 'type_id'],
        transaction
      });
      const productMap = new Map(products.map(p => [p.id, p]));

      const itemsForCost = itemsData.map(item => ({
        product_id: item.product_id,
        warehouse_id: voucher.warehouse_id,
        quantity: Number(item.quantity)
      }));

      const costsByType = {};
      let totalCost = 0;

      try {
        const { totalCost: fifoCost, itemCosts } = await FIFOCostService.calculateFIFOCostForItems(
          itemsForCost,
          transaction
        );
        totalCost = fifoCost;

        for (const itemCost of itemCosts) {
          const product = productMap.get(Number(itemCost.product_id));
          const typeId = product?.type_id || null;
          const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

          if (!costsByType[accountId]) costsByType[accountId] = 0;
          costsByType[accountId] += itemCost.cost;
        }
      } catch (error) {
        console.warn('Issue Voucher: FIFO Cost Failed, falling back to cost_price');
        for (const item of itemsData) {
          const product = productMap.get(Number(item.product_id));
          if (product && Number(product.cost_price) > 0) {
            const itemCost = Number(item.quantity) * Number(product.cost_price);
            totalCost += itemCost;
            const typeId = product?.type_id || null;
            const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;
            if (!costsByType[accountId]) costsByType[accountId] = 0;
            costsByType[accountId] += itemCost;
          }
        }
      }

      if (totalCost <= 0 && voucher.issue_type !== 'replacement') return;

      // 4. Ensure EntryType exists
      let entryType = await EntryType.findByPk(ENTRY_TYPES.ISSUE_VOUCHER, { transaction });
      if (!entryType) {
        await EntryType.create({
          id: ENTRY_TYPES.ISSUE_VOUCHER,
          name: 'قيد سند صرف',
          note: 'سند صرف مخزني'
        }, { transaction });
      }

      // 5. Create Lines
      const lines = [];

      if (voucher.issue_type === 'replacement') {
        // --- REPLACEMENT LOGIC ---
        // 1. Financial Entry: Debit Customer (47), Credit Exchange Clearing (116)
        let totalSaleValue = 0;
        const ACC_CUSTOMER = 47;
        const ACC_EXCHANGE_CLEARING = 116;

        for (const item of itemsData) {
          const product = productMap.get(Number(item.product_id));
          const price = Number(product?.price) || 0;
          totalSaleValue += Number(item.quantity) * price;
        }

        if (totalSaleValue > 0) {
          lines.push({
            account_id: ACC_CUSTOMER,
            debit: totalSaleValue,
            credit: 0,
            description: `تسوية استبدال بضاعة - سند رقم #${voucher.voucher_no}`
          });
          lines.push({
            account_id: ACC_EXCHANGE_CLEARING,
            debit: 0,
            credit: totalSaleValue,
            description: `تسوية استبدال بضاعة - سند رقم #${voucher.voucher_no}`
          });
        }

        // 2. Cost Entry: Debit COGS (15), Credit Inventory
        const ACC_COGS = 15;
        lines.push({
          account_id: ACC_COGS,
          debit: totalCost,
          credit: 0,
          description: `تكلفة بضاعة بديلة - سند رقم #${voucher.voucher_no}`
        });

        for (const [accountId, cost] of Object.entries(costsByType)) {
          if (cost > 0) {
            const account = await Account.findByPk(accountId, { transaction });
            lines.push({
              account_id: parseInt(accountId),
              debit: 0,
              credit: Math.round(cost * 100) / 100,
              description: `${account?.name || 'مخزون'} - تكلفة بضاعة بديلة - سند رقم #${voucher.voucher_no}`
            });
          }
        }
      } else {
        // --- STANDARD ISSUE LOGIC ---
        lines.push({
          account_id: debitAccount.id,
          debit: totalCost,
          credit: 0,
          description: `سند صرف مخزني رقم #${voucher.voucher_no}`
        });

        for (const [accountId, cost] of Object.entries(costsByType)) {
          if (cost > 0) {
            const account = await Account.findByPk(accountId, { transaction });
            lines.push({
              account_id: parseInt(accountId),
              debit: 0,
              credit: Math.round(cost * 100) / 100,
              description: `${account?.name || 'مخزون'} - سند صرف مخزني رقم #${voucher.voucher_no}`
            });
          }
        }
      }

      // 6. Create Journal Entry
      await createJournalEntry({
        refCode: 'issue_voucher',
        refId: voucher.id,
        entryDate: voucher.issue_date,
        description: `قيد سند صرف مخزني رقم #${voucher.voucher_no} - ${voucher.note || ''}${voucher.issue_type === 'replacement' ? ' (استبدال)' : ''}`,
        lines,
        entryTypeId: ENTRY_TYPES.ISSUE_VOUCHER
      }, { transaction });

      console.log(`Issue Voucher: Journal Entry successfully synced for Voucher #${voucher.voucher_no}`);
    } catch (error) {
      console.error(`Issue Voucher: Failed to sync journal entry for Voucher ID ${voucherId}:`, error.message);
      throw error;
    }
  }
}