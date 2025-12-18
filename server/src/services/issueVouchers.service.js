import {
  IssueVoucher,
  IssueVoucherItem,
  Product,
  Warehouse,
  IssueVoucherType,
  Party,
  Employee,
  sequelize,
  Account,
  ReferenceType
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
        }

        // --- Journal Entry Creation ---
        if (createdItems.length > 0) {
          const { createJournalEntry } = await import('./journal.service.js');

          const inventoryAccount = await Account.findOne({ where: { name: 'المخزون' }, transaction });
          // voucher.account_id acts as the debit account
          const debitAccount = await Account.findByPk(voucher.account_id, { transaction });

          let totalCost = 0;
          const productIds = createdItems.map(i => i.product_id);
          const products = await Product.findAll({
            where: { id: { [Op.in]: productIds } },
            transaction
          });
          const productMap = new Map(products.map(p => [p.id, p]));

          for (const item of createdItems) {
            const product = productMap.get(item.product_id);
            if (product && Number(product.cost_price) > 0) {
              totalCost += Number(item.quantity) * Number(product.cost_price);
            }
          }

          if (totalCost > 0 && inventoryAccount && debitAccount) {
            let refType = await ReferenceType.findOne({ where: { code: 'issue_voucher' }, transaction });
            if (!refType) {
              refType = await ReferenceType.create({
                code: 'issue_voucher',
                label: 'سند صرف',
                name: 'سند صرف',
                description: 'Journal Entry for Issue Voucher'
              }, { transaction });
            }

            await createJournalEntry({
              refCode: 'issue_voucher',
              refId: voucher.id,
              entryDate: voucher.issue_date,
              description: `Issue Voucher #${voucher.voucher_no} - ${voucher.note || ''}`,
              lines: [
                {
                  account_id: debitAccount.id,
                  debit: totalCost,
                  credit: 0,
                  description: `Issue Voucher #${voucher.voucher_no}`
                },
                {
                  account_id: inventoryAccount.id,
                  debit: 0,
                  credit: totalCost,
                  description: `Inventory - Issue Voucher #${voucher.voucher_no}`
                }
              ],
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
            model: IssueVoucherType,
            as: 'type',
            attributes: ['id', 'name']
          },
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
          model: IssueVoucherType,
          as: 'type',
          attributes: ['id', 'name']
        },
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
          model: IssueVoucherType,
          as: 'type',
          attributes: ['id', 'name']
        },
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