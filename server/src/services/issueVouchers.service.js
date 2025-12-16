import {
  IssueVoucher,
  IssueVoucherItem,
  Product,
  Warehouse,
  IssueVoucherType,
  Party,
  Employee,
  sequelize
} from '../models/index.js';
import { Op } from 'sequelize';

export class IssueVouchersService {

  // إنشاء سند إصدار جديد
  async createIssueVoucher(voucherData) {
    try {
      const voucher = await IssueVoucher.create(voucherData);
      return await this.getIssueVoucherById(voucher.id, true);
    } catch (error) {
      throw new Error(`Error creating issue voucher: ${error.message}`);
    }
  }

  // إنشاء سند إصدار مع الأصناف
  async createIssueVoucherWithItems(voucherData, itemsData = []) {
    try {
      const transaction = await sequelize.transaction();

      try {
        // إنشاء السند
        const voucher = await IssueVoucher.create(voucherData, { transaction });

        // إضافة الأصناف إذا وجدت
        if (itemsData.length > 0) {
          const itemsWithVoucherId = itemsData.map(item => ({
            ...item,
            voucher_id: voucher.id
          }));

          await IssueVoucherItem.bulkCreate(itemsWithVoucherId, { transaction });
        }

        await transaction.commit();
        return await this.getIssueVoucherById(voucher.id, true);
      } catch (error) {
        // Only rollback if transaction is not finished
        if (!transaction.finished) {
          await transaction.rollback();
        }
        throw error;
      }
    } catch (error) {
      throw new Error(`Error creating issue voucher with items: ${error.message}`);
    }
  }

  // الحصول على جميع سندات الإصدار
  async getAllIssueVouchers(filters = {}) {
    try {
      const whereClause = {};

      // تطبيق الفلاتر إذا وجدت
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
            attributes: ['id', 'name'] // إزالة code إذا لم يكن موجوداً
          },
          {
            model: Party,
            as: 'party',
            attributes: ['id', 'name'] // إزالة code
          },
          {
            model: Warehouse,
            as: 'warehouse',
            attributes: ['id', 'name'] // إزالة code
          },
          {
            model: Employee,
            as: 'responsible_employee',
            attributes: ['id', 'name'] // إزالة code
          }
        ],
        order: [['created_at', 'DESC']]
      });

      return vouchers;
    } catch (error) {
      throw new Error(`Error fetching issue vouchers: ${error.message}`);
    }
  }

  // الحصول على سند إصدار بواسطة ID
  async getIssueVoucherById(id, includeItems = false) {
    try {
      const include = [
        {
          model: IssueVoucherType,
          as: 'type',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Party,
          as: 'party',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Employee,
          as: 'responsible_employee',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Employee,
          as: 'issuer',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Employee,
          as: 'approver',
          attributes: ['id', 'name'] // إزالة code
        }
      ];

      // تضمين الأصناف إذا طلب
      if (includeItems) {
        include.push({
          model: IssueVoucherItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name'] // إزالة code و unit_id إذا تسبب في مشاكل
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

  // الحصول على سند إصدار بواسطة رقم السند
  async getIssueVoucherByVoucherNo(voucherNo, includeItems = false) {
    try {
      const include = [
        {
          model: IssueVoucherType,
          as: 'type',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Party,
          as: 'party',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Warehouse,
          as: 'warehouse',
          attributes: ['id', 'name'] // إزالة code
        },
        {
          model: Employee,
          as: 'responsible_employee',
          attributes: ['id', 'name'] // إزالة code
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
              attributes: ['id', 'name'] // إزالة code و unit_id
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

  // تحديث سند إصدار
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

  // تحديث سند إصدار مع الأصناف
  async updateIssueVoucherWithItems(id, updateData, itemsData = []) {
    try {
      const transaction = await sequelize.transaction();

      try {
        // تحديث السند
        const voucher = await IssueVoucher.findByPk(id, { transaction });
        if (!voucher) {
          throw new Error('Issue voucher not found');
        }

        await voucher.update(updateData, { transaction });

        // حذف الأصناف القديمة وإضافة الجديدة
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

  // حذف سند إصدار
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

  // تغيير حالة السند
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

  // التحقق من وجود رقم سند مكرر
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

  // الحصول على إجماليات السند
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
        const costPerUnit = parseFloat(item.cost_per_unit);

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

  // التحقق من توفر المخزون للأصناف
  async checkInventoryAvailability(items) {
    try {
      // هذه الدالة تحتاج للتكامل مع نظام إدارة المخزون
      // حالياً ترجع true كقيمة افتراضية
      const availability = {
        available: true,
        details: items.map(item => ({
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          required_quantity: item.quantity,
          available_quantity: 1000, // قيمة افتراضية
          is_available: true
        }))
      };

      return availability;
    } catch (error) {
      throw new Error(`Error checking inventory availability: ${error.message}`);
    }
  }
}