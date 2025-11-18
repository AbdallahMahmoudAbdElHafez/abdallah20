import { IssueVoucherItem, Product, Warehouse } from '../models/index.js';
import { Op } from 'sequelize';

export class IssueVoucherItemsService {
  
  // إنشاء صنف جديد في سند الإصدار
  async createIssueVoucherItem(itemData) {
    try {
      const item = await IssueVoucherItem.create(itemData);
      return await this.getIssueVoucherItemById(item.id);
    } catch (error) {
      throw new Error(`Error creating issue voucher item: ${error.message}`);
    }
  }

  // الحصول على جميع أصناف سند إصدار معين
  async getItemsByVoucherId(voucherId) {
    try {
      const items = await IssueVoucherItem.findAll({
        where: { voucher_id: voucherId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'code', 'unit_id']
          },
          {
            model: Warehouse,
            as: 'warehouse',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['created_at', 'ASC']]
      });
      
      return items;
    } catch (error) {
      throw new Error(`Error fetching issue voucher items: ${error.message}`);
    }
  }

  // الحصول على صنف بواسطة ID
  async getIssueVoucherItemById(id) {
    try {
      const item = await IssueVoucherItem.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'code', 'unit_id']
          },
          {
            model: Warehouse,
            as: 'warehouse',
            attributes: ['id', 'name', 'code']
          }
        ]
      });
      
      if (!item) {
        throw new Error('Issue voucher item not found');
      }
      
      return item;
    } catch (error) {
      throw new Error(`Error fetching issue voucher item: ${error.message}`);
    }
  }

  // تحديث صنف في سند الإصدار
  async updateIssueVoucherItem(id, updateData) {
    try {
      const item = await IssueVoucherItem.findByPk(id);
      if (!item) {
        throw new Error('Issue voucher item not found');
      }

      await item.update(updateData);
      return await this.getIssueVoucherItemById(id);
    } catch (error) {
      throw new Error(`Error updating issue voucher item: ${error.message}`);
    }
  }

  // حذف صنف من سند الإصدار
  async deleteIssueVoucherItem(id) {
    try {
      const item = await IssueVoucherItem.findByPk(id);
      if (!item) {
        throw new Error('Issue voucher item not found');
      }

      await item.destroy();
      return { message: 'Issue voucher item deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting issue voucher item: ${error.message}`);
    }
  }

  // حذف جميع أصناف سند إصدار معين
  async deleteAllItemsByVoucherId(voucherId) {
    try {
      await IssueVoucherItem.destroy({
        where: { voucher_id: voucherId }
      });
      
      return { message: 'All issue voucher items deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting issue voucher items: ${error.message}`);
    }
  }

  // الحصول على إجمالي كمية و قيمة سند الإصدار
  async getVoucherTotals(voucherId) {
    try {
      const items = await IssueVoucherItem.findAll({
        where: { voucher_id: voucherId },
        attributes: [
          'quantity',
          'unit_price',
          'cost_per_unit'
        ]
      });

      const totals = items.reduce((acc, item) => {
        const quantity = parseFloat(item.quantity);
        const unitPrice = parseFloat(item.unit_price);
        const costPerUnit = parseFloat(item.cost_per_unit);

        acc.totalQuantity += quantity;
        acc.totalValue += quantity * unitPrice;
        acc.totalCost += quantity * costPerUnit;

        return acc;
      }, {
        totalQuantity: 0,
        totalValue: 0,
        totalCost: 0
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
      // يمكنك تطويرها للتحقق من المخزون الفعلي
      return { available: true, details: [] };
    } catch (error) {
      throw new Error(`Error checking inventory availability: ${error.message}`);
    }
  }

  // تحديث تكلفة الوحدة بناءً على متوسط التكلفة
  async updateItemCosts(voucherId) {
    try {
      const items = await this.getItemsByVoucherId(voucherId);
      
      for (const item of items) {
        // هنا يمكنك إضافة منطق حساب متوسط التكلفة
        // حالياً نستخدم سعر الوحدة كتكلفة
        if (item.unit_price && !item.cost_per_unit) {
          await item.update({ cost_per_unit: item.unit_price });
        }
      }

      return { message: 'Item costs updated successfully' };
    } catch (error) {
      throw new Error(`Error updating item costs: ${error.message}`);
    }
  }
}