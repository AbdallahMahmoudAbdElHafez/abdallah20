import Joi from 'joi';
import { IssueVoucherItemsService } from '../services/IssueVoucherItems.service.js';

const issueVoucherItemsService = new IssueVoucherItemsService();

// مخطط التحقق من صحة البيانات
const itemSchema = Joi.object({
  voucher_id: Joi.number().integer().required(),
  product_id: Joi.number().integer().required(),
  warehouse_id: Joi.number().integer().required(),
  batch_number: Joi.string().max(100).allow('', null),
  expiry_date: Joi.date().allow(null),
  quantity: Joi.number().precision(3).positive().required(),
  unit_price: Joi.number().precision(2).min(0).default(0),
  cost_per_unit: Joi.number().precision(2).min(0).default(0),
  note: Joi.string().allow('', null)
});

const bulkItemSchema = Joi.array().items(itemSchema);

export class IssueVoucherItemsController {
  
  // إنشاء صنف جديد في سند الإصدار
  async createIssueVoucherItem(req, res) {
    try {
      const { error, value } = itemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const item = await issueVoucherItemsService.createIssueVoucherItem(value);
      
      res.status(201).json({
        success: true,
        message: 'Issue voucher item created successfully',
        data: item
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على جميع أصناف سند إصدار معين
  async getItemsByVoucherId(req, res) {
    try {
      const { voucherId } = req.params;
      const items = await issueVoucherItemsService.getItemsByVoucherId(parseInt(voucherId));
      
      res.status(200).json({
        success: true,
        data: items
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على صنف بواسطة ID
  async getIssueVoucherItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await issueVoucherItemsService.getIssueVoucherItemById(parseInt(id));
      
      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث صنف في سند الإصدار
  async updateIssueVoucherItem(req, res) {
    try {
      const { id } = req.params;
      
      const { error, value } = itemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const item = await issueVoucherItemsService.updateIssueVoucherItem(parseInt(id), value);
      
      res.status(200).json({
        success: true,
        message: 'Issue voucher item updated successfully',
        data: item
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // حذف صنف من سند الإصدار
  async deleteIssueVoucherItem(req, res) {
    try {
      const { id } = req.params;
      const result = await issueVoucherItemsService.deleteIssueVoucherItem(parseInt(id));
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher item not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // إنشاء عدة أصناف دفعة واحدة
  async createBulkItems(req, res) {
    try {
      const { error, value } = bulkItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const createdItems = [];
      for (const itemData of value) {
        const item = await issueVoucherItemsService.createIssueVoucherItem(itemData);
        createdItems.push(item);
      }
      
      res.status(201).json({
        success: true,
        message: 'Issue voucher items created successfully',
        data: createdItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // حذف جميع أصناف سند إصدار معين
  async deleteAllItemsByVoucherId(req, res) {
    try {
      const { voucherId } = req.params;
      const result = await issueVoucherItemsService.deleteAllItemsByVoucherId(parseInt(voucherId));
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على إجمالي كمية و قيمة سند الإصدار
  async getVoucherTotals(req, res) {
    try {
      const { voucherId } = req.params;
      const totals = await issueVoucherItemsService.getVoucherTotals(parseInt(voucherId));
      
      res.status(200).json({
        success: true,
        data: totals
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // التحقق من توفر المخزون
  async checkInventoryAvailability(req, res) {
    try {
      const { error, value } = bulkItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const availability = await issueVoucherItemsService.checkInventoryAvailability(value);
      
      res.status(200).json({
        success: true,
        data: availability
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث تكلفة الأصناف
  async updateItemCosts(req, res) {
    try {
      const { voucherId } = req.params;
      const result = await issueVoucherItemsService.updateItemCosts(parseInt(voucherId));
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}