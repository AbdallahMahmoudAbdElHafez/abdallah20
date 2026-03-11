import {
    IssueVoucherReturn,
    IssueVoucherReturnItem,
    IssueVoucher,
    IssueVoucherItem,
    Product,
    Warehouse,
    Employee,
    Unit,
    sequelize,
} from '../models/index.js';
import { Op } from 'sequelize';

export class IssueVoucherReturnsService {

    // إنشاء مرتجع اذن صرف مع الأصناف
    async createReturnWithItems(returnData, itemsData = []) {
        const transaction = await sequelize.transaction();
        try {
            const returnRecord = await IssueVoucherReturn.create(returnData, { transaction });

            if (itemsData.length > 0) {
                const items = itemsData.map(item => ({
                    ...item,
                    return_id: returnRecord.id
                }));
                await IssueVoucherReturnItem.bulkCreate(items, { transaction });
            }

            await transaction.commit();

            return await this.getReturnById(returnRecord.id, true);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // الحصول على جميع مرتجعات اذون الصرف
    async getAllReturns(filters = {}) {
        const where = {};

        if (filters.status) {
            where.status = filters.status;
        }
        if (filters.warehouse_id) {
            where.warehouse_id = filters.warehouse_id;
        }
        if (filters.issue_voucher_id) {
            where.issue_voucher_id = filters.issue_voucher_id;
        }
        if (filters.start_date && filters.end_date) {
            where.return_date = {
                [Op.between]: [filters.start_date, filters.end_date]
            };
        } else if (filters.start_date) {
            where.return_date = {
                [Op.gte]: filters.start_date
            };
        } else if (filters.end_date) {
            where.return_date = {
                [Op.lte]: filters.end_date
            };
        }

        return await IssueVoucherReturn.findAll({
            where,
            include: [
                {
                    model: IssueVoucher,
                    as: 'issue_voucher',
                    attributes: ['id', 'voucher_no', 'issue_date', 'status']
                },
                {
                    model: Warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name']
                },
                {
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'name']
                },
                {
                    model: Employee,
                    as: 'approver',
                    attributes: ['id', 'name']
                }
            ],
            order: [['created_at', 'DESC']]
        });
    }

    // الحصول على مرتجع بواسطة ID
    async getReturnById(id, includeItems = false) {
        const include = [
            {
                model: IssueVoucher,
                as: 'issue_voucher',
                attributes: ['id', 'voucher_no', 'issue_date', 'status', 'warehouse_id'],
                include: [
                    {
                        model: Warehouse,
                        as: 'warehouse',
                        attributes: ['id', 'name']
                    }
                ]
            },
            {
                model: Warehouse,
                as: 'warehouse',
                attributes: ['id', 'name']
            },
            {
                model: Employee,
                as: 'employee',
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
                model: IssueVoucherReturnItem,
                as: 'items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'code'],
                        include: [
                            { model: Unit, as: 'unit', attributes: ['id', 'name'] }
                        ]
                    }
                ]
            });
        }

        const record = await IssueVoucherReturn.findByPk(id, { include });

        if (!record) {
            throw new Error('Issue voucher return not found');
        }

        return record;
    }

    // تحديث مرتجع مع الأصناف
    async updateReturnWithItems(id, updateData, itemsData = []) {
        const transaction = await sequelize.transaction();
        try {
            const record = await IssueVoucherReturn.findByPk(id);
            if (!record) {
                throw new Error('Issue voucher return not found');
            }

            await record.update(updateData, { transaction });

            // حذف الأصناف القديمة وإنشاء الجديدة
            await IssueVoucherReturnItem.destroy({
                where: { return_id: id },
                transaction
            });

            if (itemsData.length > 0) {
                const items = itemsData.map(item => ({
                    ...item,
                    return_id: id
                }));
                await IssueVoucherReturnItem.bulkCreate(items, { transaction });
            }

            await transaction.commit();

            return await this.getReturnById(id, true);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // حذف مرتجع
    async deleteReturn(id) {
        const record = await IssueVoucherReturn.findByPk(id);
        if (!record) {
            throw new Error('Issue voucher return not found');
        }

        if (record.status !== 'draft') {
            throw new Error('Only draft returns can be deleted');
        }

        await record.destroy();
        return { message: 'Issue voucher return deleted successfully' };
    }

    // تحديث الحالة
    async updateReturnStatus(id, status, approvedBy = null) {
        const transaction = await sequelize.transaction();
        try {
            const record = await IssueVoucherReturn.findByPk(id, { transaction });
            if (!record) {
                throw new Error('Issue voucher return not found');
            }

            const oldStatus = record.status;
            const updateData = { status };
            if (approvedBy) {
                updateData.approved_by = approvedBy;
            }

            await record.update(updateData, { transaction });

            if (status === 'posted' && oldStatus !== 'posted') {
                const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;
                const { createJournalEntry } = await import('./journal.service.js');
                const { Account, ReferenceType, EntryType, Product: ProductModel } = await import('../models/index.js');
                const { ENTRY_TYPES } = await import('../constants/entryTypes.js');

                // 1. Get return with items and original voucher
                const returnWithDetails = await this.getReturnById(id, true);
                const originalVoucher = await IssueVoucher.findByPk(record.issue_voucher_id, { transaction });

                const INVENTORY_ACCOUNTS = { FINISHED_GOODS: 110, RAW_MATERIALS: 111, DEFAULT: 49 };
                const PRODUCT_TYPE_TO_ACCOUNT = { 1: INVENTORY_ACCOUNTS.FINISHED_GOODS, 2: INVENTORY_ACCOUNTS.RAW_MATERIALS };

                let totalCreditAmount = 0;
                const inventoryDebits = {};

                // 2. Create IN transactions & calculate costs
                for (const item of returnWithDetails.items) {
                    if (Number(item.quantity) > 0) {
                        const batchData = [{
                            batch_number: item.batch_number,
                            expiry_date: item.expiry_date,
                            quantity: item.quantity,
                            cost_per_unit: item.cost_per_unit || 0
                        }];

                        await InventoryTransactionService.create({
                            product_id: item.product_id,
                            warehouse_id: record.warehouse_id,
                            transaction_type: 'in',
                            transaction_date: record.return_date,
                            note: `مرتجع اذن صرف رقم #${record.return_no}`,
                            source_type: 'issue_voucher_return',
                            source_id: item.id,
                            batches: batchData
                        }, { transaction });

                        // Cost calculation
                        const product = await ProductModel.findByPk(item.product_id, { transaction });
                        const cost = Number(item.quantity) * Number(item.cost_per_unit || product?.cost_price || 0);
                        const typeId = product?.type_id || null;
                        const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

                        if (!inventoryDebits[accountId]) inventoryDebits[accountId] = 0;
                        inventoryDebits[accountId] += cost;
                        totalCreditAmount += cost;
                    }
                }

                // 3. Create Journal Entry
                if (totalCreditAmount > 0) {
                    let refType = await ReferenceType.findOne({ where: { code: 'issue_voucher_return' }, transaction });
                    if (!refType) {
                        refType = await ReferenceType.create({
                            code: 'issue_voucher_return',
                            name: 'مردود منصرف',
                            label: 'مردود منصرف مخزني',
                            description: 'Journal Entry for Issue Voucher Return'
                        }, { transaction });
                    }

                    let entryType = await EntryType.findByPk(ENTRY_TYPES.ISSUE_VOUCHER, { transaction });
                    if (!entryType) {
                        await EntryType.create({ id: ENTRY_TYPES.ISSUE_VOUCHER, name: 'قيد سند صرف', note: 'سند صرف مخزني' }, { transaction });
                    }

                    const lines = [];
                    // For returns, we Debit the Inventory accounts
                    for (const [accountId, cost] of Object.entries(inventoryDebits)) {
                        if (cost > 0) {
                            const account = await Account.findByPk(accountId, { transaction });
                            lines.push({
                                account_id: parseInt(accountId),
                                debit: Math.round(cost * 100) / 100,
                                credit: 0,
                                description: `${account?.name || 'مخزون'} - مردود منصرف رقم #${record.return_no}`
                            });
                        }
                    }

                    // And Credit the Expense/Original Debit Account
                    let creditAccountId = originalVoucher.account_id;
                    // Fallback to COGS if replacement
                    if (originalVoucher.issue_type === 'replacement') {
                        creditAccountId = 15; // COGS account ID
                    }

                    // Make sure creditAccountId is valid
                    if (!creditAccountId) {
                        // Default to miscellaneous expense if not found
                        const defaultExpense = await Account.findOne({ where: { name: 'المصروفات' }, transaction });
                        creditAccountId = defaultExpense ? defaultExpense.id : 49;
                    }

                    lines.push({
                        account_id: creditAccountId,
                        debit: 0,
                        credit: Math.round(totalCreditAmount * 100) / 100,
                        description: `مردود منصرف رقم #${record.return_no} (عكس التكلفة)`
                    });

                    await createJournalEntry({
                        refCode: 'issue_voucher_return',
                        refId: record.id,
                        entryDate: record.return_date,
                        description: `قيد مردود منصرف رقم #${record.return_no}${originalVoucher.issue_type === 'replacement' ? ' (استبدال)' : ''}`,
                        lines,
                        entryTypeId: ENTRY_TYPES.ISSUE_VOUCHER
                    }, { transaction });
                }
            }

            await transaction.commit();
            return await this.getReturnById(id, true);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error updating return status: ${error.message}`);
        }
    }

    // التحقق من أن رقم المرتجع فريد
    async isReturnNoUnique(returnNo, excludeId = null) {
        const where = { return_no: returnNo };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        const count = await IssueVoucherReturn.count({ where });
        return count === 0;
    }

    // الحصول على أصناف اذن الصرف (لاستخدامها عند إنشاء المرتجع)
    async getIssueVoucherItems(issueVoucherId) {
        const voucher = await IssueVoucher.findByPk(issueVoucherId, {
            include: [
                {
                    model: IssueVoucherItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'code'],
                            include: [
                                { model: Unit, as: 'unit', attributes: ['id', 'name'] }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!voucher) {
            throw new Error('Issue voucher not found');
        }

        return voucher.items;
    }
}
