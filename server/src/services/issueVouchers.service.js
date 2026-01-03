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
  Doctor
} from '../models/index.js';
import { Op } from 'sequelize';

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
    try {
      const transaction = await sequelize.transaction();

      try {
        const voucher = await IssueVoucher.create(voucherData, { transaction });

        let createdItems = [];
        if (itemsData.length > 0) {
          const itemsWithVoucherId = itemsData.map(item => ({
            ...item,
            voucher_id: voucher.id
          }));

          createdItems = await IssueVoucherItem.bulkCreate(itemsWithVoucherId, { transaction });

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
        if (createdItems.length > 0) {
          const { createJournalEntry } = await import('./journal.service.js');

          // Inventory Account IDs by Product Type
          const INVENTORY_ACCOUNTS = {
            FINISHED_GOODS: 110,    // مخزون تام الصنع (منتج تام - type_id: 1)
            RAW_MATERIALS: 111,     // مخزون أولي (مستلزم انتاج - type_id: 2)
            DEFAULT: 49             // المخزون (fallback)
          };

          const PRODUCT_TYPE_TO_ACCOUNT = {
            1: INVENTORY_ACCOUNTS.FINISHED_GOODS,
            2: INVENTORY_ACCOUNTS.RAW_MATERIALS
          };

          // voucher.account_id acts as the debit account
          const debitAccount = await Account.findByPk(voucher.account_id, { transaction });

          // Import FIFO Cost Service
          const FIFOCostService = (await import('./fifoCost.service.js')).default;

          // Get products with type_id
          const productIds = createdItems.map(i => i.product_id);
          const products = await Product.findAll({
            where: { id: { [Op.in]: productIds } },
            transaction
          });
          const productMap = new Map(products.map(p => [p.id, p]));

          // Prepare items for FIFO cost calculation
          const itemsForCost = createdItems.map(item => ({
            product_id: item.product_id,
            warehouse_id: voucher.warehouse_id,
            quantity: Number(item.quantity)
          }));

          // Calculate costs grouped by product type
          const costsByType = {};
          let totalCost = 0;

          try {
            const { totalCost: fifoCost, itemCosts } = await FIFOCostService.calculateFIFOCostForItems(
              itemsForCost,
              transaction
            );
            totalCost = fifoCost;

            // Group costs by product type
            for (const itemCost of itemCosts) {
              const product = productMap.get(itemCost.product_id);
              const typeId = product?.type_id || null;
              const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

              if (!costsByType[accountId]) {
                costsByType[accountId] = 0;
              }
              costsByType[accountId] += itemCost.totalCost;
            }
            console.log('Issue Voucher: FIFO Cost Calculation Success. Total:', totalCost);
          } catch (error) {
            console.error('Issue Voucher: FIFO Cost Calculation Failed:', error.message);
            console.warn('Issue Voucher: Falling back to product cost_price due to FIFO error');

            for (const item of createdItems) {
              const product = productMap.get(item.product_id);
              if (product && Number(product.cost_price) > 0) {
                const itemCost = Number(item.quantity) * Number(product.cost_price);
                totalCost += itemCost;

                const typeId = product?.type_id || null;
                const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

                if (!costsByType[accountId]) {
                  costsByType[accountId] = 0;
                }
                costsByType[accountId] += itemCost;
              }
            }
          }

          if (totalCost > 0 && debitAccount) {
            let refType = await ReferenceType.findOne({ where: { code: 'issue_voucher' }, transaction });
            if (!refType) {
              refType = await ReferenceType.create({
                code: 'issue_voucher',
                label: 'سند صرف',
                name: 'سند صرف',
                description: 'Journal Entry for Issue Voucher'
              }, { transaction });
            }

            // Build journal entry lines
            const lines = [
              {
                account_id: debitAccount.id,
                debit: totalCost,
                credit: 0,
                description: `Issue Voucher #${voucher.voucher_no}`
              }
            ];

            // Add credit lines for each inventory account
            for (const [accountId, cost] of Object.entries(costsByType)) {
              if (cost > 0) {
                const account = await Account.findByPk(accountId, { transaction });
                lines.push({
                  account_id: parseInt(accountId),
                  debit: 0,
                  credit: cost,
                  description: `${account?.name || 'مخزون'} - Issue Voucher #${voucher.voucher_no}`
                });
              }
            }

            await createJournalEntry({
              refCode: 'issue_voucher',
              refId: voucher.id,
              entryDate: voucher.issue_date,
              description: `Issue Voucher #${voucher.voucher_no} - ${voucher.note || ''}`,
              lines,
              entryTypeId: 1
            }, { transaction });
          }
        }

        await transaction.commit();
        return await this.getIssueVoucherById(voucher.id, true);
      } catch (error) {
        if (!transaction.finished) {
          await transaction.rollback();
        }
        throw error;
      }
    } catch (error) {
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
              attributes: ['id', 'name', 'cost_price']
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
              attributes: ['id', 'name', 'cost_price']
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
    try {
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

        await transaction.commit();
        return await this.getIssueVoucherById(id, true);
      } catch (error) {
        if (!transaction.finished) {
          await transaction.rollback();
        }
        throw error;
      }
    } catch (error) {
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
}