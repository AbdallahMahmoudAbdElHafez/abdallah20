import Joi from 'joi';
import { IssueVouchersService } from '../services/issueVouchers.service.js';

const issueVouchersService = new IssueVouchersService();
const voucherSchema = Joi.object({
  voucher_no: Joi.string().max(100).required(),
  doctor_id: Joi.number().integer().allow(null),
  party_id: Joi.number().integer().allow(null),
  employee_id: Joi.number().integer().allow(null),
  warehouse_id: Joi.number().integer().required(),
  account_id: Joi.number().integer().required(),
  issued_by: Joi.number().integer().allow(null),
  approved_by: Joi.number().integer().allow(null),
  status: Joi.string().valid('draft', 'approved', 'posted', 'cancelled').default('draft'),
  issue_date: Joi.date().required(),
  note: Joi.string().allow('', null)
});

const voucherWithItemsSchema = Joi.object({
  voucher_no: Joi.string().max(100).required(),
  doctor_id: Joi.number().integer().allow(null),
  party_id: Joi.number().integer().allow(null),
  employee_id: Joi.number().integer().allow(null),
  warehouse_id: Joi.number().integer().required(),
  account_id: Joi.number().integer().required(),
  issued_by: Joi.number().integer().allow(null),
  approved_by: Joi.number().integer().allow(null),
  status: Joi.string().valid('draft', 'approved', 'posted', 'cancelled').default('draft'),
  issue_date: Joi.date().required(),
  note: Joi.string().allow('', null),
  items: Joi.array().items(Joi.object({
    product_id: Joi.number().integer().required(),

    batch_number: Joi.string().max(100).allow('', null),
    expiry_date: Joi.date().allow(null),
    quantity: Joi.number().precision(3).positive().required(),
    cost_per_unit: Joi.number().precision(2).min(0).default(0),
    note: Joi.string().allow('', null)
  })).default([])
});

const statusSchema = Joi.object({
  status: Joi.string().valid('draft', 'approved', 'posted', 'cancelled').required(),
  approved_by: Joi.number().integer().allow(null)
});

export class IssueVouchersController {

  // إنشاء سند إصدار جديد (مع أو بدون أصناف)
  async createIssueVoucher(req, res) {
    try {
      const { error, value } = voucherWithItemsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      // التحقق من أن رقم السند فريد
      const isUnique = await issueVouchersService.isVoucherNoUnique(value.voucher_no);
      if (!isUnique) {
        return res.status(400).json({
          success: false,
          message: 'Voucher number already exists'
        });
      }

      // فصل بيانات السند عن الأصناف
      const { items, ...voucherData } = value;

      let voucher;
      if (items && items.length > 0) {
        // إنشاء السند مع الأصناف
        voucher = await issueVouchersService.createIssueVoucherWithItems(voucherData, items);
      } else {
        // إنشاء السند بدون أصناف
        voucher = await issueVouchersService.createIssueVoucher(voucherData);
      }

      res.status(201).json({
        success: true,
        message: 'Issue voucher created successfully',
        data: voucher
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على جميع سندات الإصدار
  async getAllIssueVouchers(req, res) {
    try {
      const filters = {
        status: req.query.status,
        warehouse_id: req.query.warehouse_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date
      };

      const vouchers = await issueVouchersService.getAllIssueVouchers(filters);

      res.status(200).json({
        success: true,
        data: vouchers
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على سند إصدار بواسطة ID (مع الأصناف)
  async getIssueVoucherById(req, res) {
    try {
      const { id } = req.params;
      const includeItems = req.query.include_items === 'true';

      const voucher = await issueVouchersService.getIssueVoucherById(parseInt(id), includeItems);

      res.status(200).json({
        success: true,
        data: voucher
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث سند إصدار (مع أو بدون أصناف)
  async updateIssueVoucher(req, res) {
    try {
      const { id } = req.params;

      const { error, value } = voucherWithItemsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      // التحقق من أن رقم السند فريد (استثناء السند الحالي)
      const isUnique = await issueVouchersService.isVoucherNoUnique(value.voucher_no, parseInt(id));
      if (!isUnique) {
        return res.status(400).json({
          success: false,
          message: 'Voucher number already exists'
        });
      }

      // فصل بيانات السند عن الأصناف
      const { items, ...voucherData } = value;

      let voucher;
      if (items) {
        // تحديث السند مع الأصناف
        voucher = await issueVouchersService.updateIssueVoucherWithItems(parseInt(id), voucherData, items);
      } else {
        // تحديث السند بدون تعديل الأصناف
        voucher = await issueVouchersService.updateIssueVoucher(parseInt(id), voucherData);
      }

      res.status(200).json({
        success: true,
        message: 'Issue voucher updated successfully',
        data: voucher
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // حذف سند إصدار
  async deleteIssueVoucher(req, res) {
    try {
      const { id } = req.params;
      const result = await issueVouchersService.deleteIssueVoucher(parseInt(id));

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // تحديث حالة السند
  async updateVoucherStatus(req, res) {
    try {
      const { id } = req.params;

      const { error, value } = statusSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
      }

      const voucher = await issueVouchersService.updateVoucherStatus(
        parseInt(id),
        value.status,
        value.approved_by
      );

      res.status(200).json({
        success: true,
        message: `Voucher status updated to ${value.status}`,
        data: voucher
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على سند إصدار بواسطة رقم السند
  async getIssueVoucherByVoucherNo(req, res) {
    try {
      const { voucher_no } = req.params;
      const includeItems = req.query.include_items === 'true';

      const voucher = await issueVouchersService.getIssueVoucherByVoucherNo(voucher_no, includeItems);

      res.status(200).json({
        success: true,
        data: voucher
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // الحصول على إجماليات السند
  async getVoucherTotals(req, res) {
    try {
      const { id } = req.params;
      const totals = await issueVouchersService.getVoucherTotals(parseInt(id));

      res.status(200).json({
        success: true,
        data: totals
      });
    } catch (error) {
      const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // التحقق من توفر المخزون للأصناف
  async checkInventoryAvailability(req, res) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required'
        });
      }

      const availability = await issueVouchersService.checkInventoryAvailability(items);

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
}
