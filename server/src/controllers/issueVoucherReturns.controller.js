import Joi from 'joi';
import { IssueVoucherReturnsService } from '../services/issueVoucherReturns.service.js';

const issueVoucherReturnsService = new IssueVoucherReturnsService();

const returnWithItemsSchema = Joi.object({
    return_no: Joi.string().max(100).required(),
    issue_voucher_id: Joi.number().integer().required(),
    warehouse_id: Joi.number().integer().required(),
    return_date: Joi.date().required(),
    status: Joi.string().valid('draft', 'approved', 'posted', 'cancelled').default('draft'),
    employee_id: Joi.number().integer().allow(null),
    approved_by: Joi.number().integer().allow(null),
    note: Joi.string().allow('', null),
    items: Joi.array().items(Joi.object({
        product_id: Joi.number().integer().required(),
        batch_number: Joi.string().max(100).allow('', null),
        expiry_date: Joi.date().allow(null),
        returned_quantity: Joi.number().precision(3).min(0).default(0),
        quantity: Joi.number().precision(3).positive().required(),
        cost_per_unit: Joi.number().precision(2).min(0).allow(null),
    })).default([])
});

const statusSchema = Joi.object({
    status: Joi.string().valid('draft', 'approved', 'posted', 'cancelled').required(),
    approved_by: Joi.number().integer().allow(null)
});

export class IssueVoucherReturnsController {

    // إنشاء مرتجع جديد
    async createReturn(req, res) {
        try {
            const { error, value } = returnWithItemsSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: error.details[0].message
                });
            }

            const isUnique = await issueVoucherReturnsService.isReturnNoUnique(value.return_no);
            if (!isUnique) {
                return res.status(400).json({
                    success: false,
                    message: 'Return number already exists'
                });
            }

            const { items, ...returnData } = value;
            const result = await issueVoucherReturnsService.createReturnWithItems(returnData, items);

            res.status(201).json({
                success: true,
                message: 'Issue voucher return created successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // الحصول على جميع المرتجعات
    async getAllReturns(req, res) {
        try {
            const filters = {
                status: req.query.status,
                warehouse_id: req.query.warehouse_id,
                issue_voucher_id: req.query.issue_voucher_id,
                start_date: req.query.start_date,
                end_date: req.query.end_date
            };

            const returns = await issueVoucherReturnsService.getAllReturns(filters);

            res.status(200).json({
                success: true,
                data: returns
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // الحصول على مرتجع بواسطة ID
    async getReturnById(req, res) {
        try {
            const { id } = req.params;
            const includeItems = req.query.include_items === 'true';

            const result = await issueVoucherReturnsService.getReturnById(parseInt(id), includeItems);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Issue voucher return not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // تحديث مرتجع
    async updateReturn(req, res) {
        try {
            const { id } = req.params;

            const { error, value } = returnWithItemsSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    error: error.details[0].message
                });
            }

            const isUnique = await issueVoucherReturnsService.isReturnNoUnique(value.return_no, parseInt(id));
            if (!isUnique) {
                return res.status(400).json({
                    success: false,
                    message: 'Return number already exists'
                });
            }

            const { items, ...returnData } = value;
            const result = await issueVoucherReturnsService.updateReturnWithItems(parseInt(id), returnData, items);

            res.status(200).json({
                success: true,
                message: 'Issue voucher return updated successfully',
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Issue voucher return not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // حذف مرتجع
    async deleteReturn(req, res) {
        try {
            const { id } = req.params;
            const result = await issueVoucherReturnsService.deleteReturn(parseInt(id));

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            const statusCode = error.message === 'Issue voucher return not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // تحديث الحالة
    async updateReturnStatus(req, res) {
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

            const result = await issueVoucherReturnsService.updateReturnStatus(
                parseInt(id),
                value.status,
                value.approved_by
            );

            res.status(200).json({
                success: true,
                message: `Return status updated to ${value.status}`,
                data: result
            });
        } catch (error) {
            const statusCode = error.message === 'Issue voucher return not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }

    // الحصول على أصناف اذن الصرف
    async getIssueVoucherItems(req, res) {
        try {
            const { voucherId } = req.params;
            const items = await issueVoucherReturnsService.getIssueVoucherItems(parseInt(voucherId));

            res.status(200).json({
                success: true,
                data: items
            });
        } catch (error) {
            const statusCode = error.message === 'Issue voucher not found' ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message
            });
        }
    }
}
