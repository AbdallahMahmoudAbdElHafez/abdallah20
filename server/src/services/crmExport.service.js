import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { SalesInvoice, SalesReturn } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXPORT_DIR = path.resolve(__dirname, '../../crm_exports');

class CrmExportService {
    async ensureExportDir() {
        try {
            await fs.mkdir(EXPORT_DIR, { recursive: true });
        } catch (err) {
            console.error('[CRM Export] Error creating directory:', err);
        }
    }

    /**
     * Calculate net unit price after item discount, prorated additional discount, and VAT
     */
    calculateItemNetUnitPrice(item, invoice) {
        const qty = Number(item.quantity) || 0;
        const rawPrice = Number(item.price) || 0;
        const itemDiscount = Number(item.discount) || 0;

        // 1. Gross minus line discount
        const itemBase = Math.max(0, (qty * rawPrice) - itemDiscount);

        // 2. Pro-rated additional discount from invoice header
        let proratedAddDisc = 0;
        const invoiceSubtotal = Number(invoice?.subtotal) || 0;
        const additionalDiscount = Number(invoice?.additional_discount) || 0;
        if (invoiceSubtotal > 0 && additionalDiscount > 0) {
            const addDiscRatio = additionalDiscount / invoiceSubtotal;
            proratedAddDisc = itemBase * addDiscRatio;
        }
        const itemAfterDiscounts = Math.max(0, itemBase - proratedAddDisc);

        // 3. VAT (Value Added Tax)
        const vatRate = Number(item.vat_rate !== null && item.vat_rate !== undefined ? item.vat_rate : (invoice?.vat_rate ?? 0)) || 0;
        let itemVat = 0;
        if (vatRate > 0) {
            itemVat = itemAfterDiscounts * (vatRate / 100);
        } else if (Number(item.vat_amount) > 0) {
            const discountRatio = (invoiceSubtotal > 0 && additionalDiscount > 0) ? (additionalDiscount / invoiceSubtotal) : 0;
            itemVat = Number(item.vat_amount) * (1 - discountRatio);
        }

        // 4. Net line total after discounts + VAT
        const lineFinalTotal = itemAfterDiscounts + itemVat;

        // 5. Unit price
        return qty > 0 ? Number((lineFinalTotal / qty).toFixed(2)) : rawPrice;
    }

    /**
     * Export sales invoice to JSON file upon approval
     * Format: Array of objects with product_id, user_id, quantity, unit_price
     */
    async exportSalesInvoice(invoiceId, transaction = null) {
        try {
            await this.ensureExportDir();

            const invoice = await SalesInvoice.findByPk(invoiceId, {
                include: [
                    { association: 'employee' },
                    { association: 'items', include: [{ association: 'product' }] }
                ],
                transaction
            });

            if (!invoice) {
                console.warn(`[CRM Export] Sales Invoice #${invoiceId} not found.`);
                return null;
            }

            const crmUserId = invoice.employee ? invoice.employee.crm_user_id : null;
            const safeInvoiceNumber = (invoice.invoice_number || `invoice_${invoice.id}`).replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `sales_invoice_${safeInvoiceNumber}.json`;
            const filePath = path.join(EXPORT_DIR, fileName);

            if (!crmUserId) {
                console.log(`[CRM Export] Skipping JSON export for Sales Invoice #${invoiceId}: No user_id (crm_user_id is missing).`);
                try {
                    await fs.unlink(filePath);
                } catch (e) {
                    // Ignore if file does not exist
                }
                return null;
            }

            const items = invoice.items || [];
            if (items.length === 0) {
                console.log(`[CRM Export] Skipping JSON export for Sales Invoice #${invoiceId}: No items found.`);
                return null;
            }

            const exportData = items.map(item => ({
                product_id: item.product ? item.product.crm_product_id : null,
                user_id: crmUserId,
                quantity: Number(item.quantity) || 0,
                unit_price: this.calculateItemNetUnitPrice(item, invoice)
            }));

            await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf8');
            console.log(`[CRM Export] Sales invoice exported to: ${filePath}`);

            return { filePath, data: exportData };
        } catch (error) {
            console.error(`[CRM Export] Error exporting sales invoice #${invoiceId}:`, error);
            return null;
        }
    }

    /**
     * Export sales return to JSON file upon creation/approval
     * Format: Array of objects with product_id, user_id, quantity, unit_price
     */
    async exportSalesReturn(returnId, transaction = null) {
        try {
            await this.ensureExportDir();

            const salesReturn = await SalesReturn.findByPk(returnId, {
                include: [
                    { association: 'employee' },
                    { association: 'invoice', include: [{ association: 'employee' }, { association: 'items' }] },
                    { association: 'items', include: [{ association: 'product' }] }
                ],
                transaction
            });

            if (!salesReturn) {
                console.warn(`[CRM Export] Sales Return #${returnId} not found.`);
                return null;
            }

            // User ID from sales return employee, fallback to invoice employee
            const crmUserId = salesReturn.employee?.crm_user_id 
                ?? salesReturn.invoice?.employee?.crm_user_id 
                ?? null;

            const fileName = `sales_return_${salesReturn.id}.json`;
            const filePath = path.join(EXPORT_DIR, fileName);

            if (!crmUserId) {
                console.log(`[CRM Export] Skipping JSON export for Sales Return #${returnId}: No user_id (crm_user_id is missing).`);
                try {
                    await fs.unlink(filePath);
                } catch (e) {
                    // Ignore if file does not exist
                }
                return null;
            }

            const items = salesReturn.items || [];
            if (items.length === 0) {
                console.log(`[CRM Export] Skipping JSON export for Sales Return #${returnId}: No items found.`);
                return null;
            }

            const exportData = items.map(item => {
                let unitPrice = Number(item.price) || 0;
                // If linked to original invoice item, calculate net unit price from invoice
                if (salesReturn.invoice?.items) {
                    const originalItem = salesReturn.invoice.items.find(i => i.product_id === item.product_id);
                    if (originalItem) {
                        unitPrice = this.calculateItemNetUnitPrice(originalItem, salesReturn.invoice);
                    }
                }

                return {
                    product_id: item.product ? item.product.crm_product_id : null,
                    user_id: crmUserId,
                    quantity: Number(item.quantity) || 0,
                    unit_price: unitPrice
                };
            });

            await fs.writeFile(filePath, JSON.stringify(exportData, null, 2), 'utf8');
            console.log(`[CRM Export] Sales return exported to: ${filePath}`);

            return { filePath, data: exportData };
        } catch (error) {
            console.error(`[CRM Export] Error exporting sales return #${returnId}:`, error);
            return null;
        }
    }

    /**
     * Export sales and returns for a specific date range
     */
    async exportPeriod(startDate, endDate, fileNamePrefix = null) {
        try {
            await this.ensureExportDir();
            const { Op } = (await import('sequelize')).default;

            const invoices = await SalesInvoice.findAll({
                where: {
                    invoice_date: {
                        [Op.between]: [startDate, `${endDate} 23:59:59`]
                    },
                    invoice_status: 'approved'
                },
                include: [
                    { association: 'employee' },
                    { association: 'items', include: [{ association: 'product' }] }
                ],
                order: [['invoice_date', 'ASC'], ['id', 'ASC']]
            });

            const returns = await SalesReturn.findAll({
                where: {
                    return_date: {
                        [Op.between]: [startDate, `${endDate} 23:59:59`]
                    },
                    status: 'approved'
                },
                include: [
                    { association: 'employee' },
                    { association: 'invoice', include: [{ association: 'employee' }, { association: 'items' }] },
                    { association: 'items', include: [{ association: 'product' }] }
                ],
                order: [['return_date', 'ASC'], ['id', 'ASC']]
            });

            const sales = [];
            for (const invoice of invoices) {
                const crmUserId = invoice.employee?.crm_user_id;
                if (!crmUserId) continue; // Skip if no user_id

                for (const item of (invoice.items || [])) {
                    sales.push({
                        product_id: item.product ? item.product.crm_product_id : null,
                        user_id: crmUserId,
                        quantity: Number(item.quantity) || 0,
                        unit_price: this.calculateItemNetUnitPrice(item, invoice)
                    });
                }
            }

            const returnList = [];
            for (const salesReturn of returns) {
                const crmUserId = salesReturn.employee?.crm_user_id 
                    ?? salesReturn.invoice?.employee?.crm_user_id 
                    ?? null;
                if (!crmUserId) continue; // Skip if no user_id

                for (const item of (salesReturn.items || [])) {
                    let unitPrice = Number(item.price) || 0;
                    if (salesReturn.invoice?.items) {
                        const originalItem = salesReturn.invoice.items.find(i => i.product_id === item.product_id);
                        if (originalItem) {
                            unitPrice = this.calculateItemNetUnitPrice(originalItem, salesReturn.invoice);
                        }
                    }

                    returnList.push({
                        product_id: item.product ? item.product.crm_product_id : null,
                        user_id: crmUserId,
                        quantity: Number(item.quantity) || 0,
                        unit_price: unitPrice
                    });
                }
            }

            const prefix = fileNamePrefix || `period_${startDate}_to_${endDate}`;

            // 1. Combined object: { sales, returns }
            const combinedObjPath = path.join(EXPORT_DIR, `sales_and_returns_${prefix}.json`);
            await fs.writeFile(combinedObjPath, JSON.stringify({ sales, returns: returnList }, null, 2), 'utf8');

            // 2. Sales array only
            const salesPath = path.join(EXPORT_DIR, `sales_${prefix}.json`);
            await fs.writeFile(salesPath, JSON.stringify(sales, null, 2), 'utf8');

            // 3. Returns array only
            const returnsPath = path.join(EXPORT_DIR, `returns_${prefix}.json`);
            await fs.writeFile(returnsPath, JSON.stringify(returnList, null, 2), 'utf8');

            // 4. Combined flat array with negative quantity for returns
            const flatCombined = [
                ...sales,
                ...returnList.map(r => ({ ...r, quantity: -Math.abs(r.quantity) }))
            ];
            const flatCombinedPath = path.join(EXPORT_DIR, `combined_transactions_${prefix}.json`);
            await fs.writeFile(flatCombinedPath, JSON.stringify(flatCombined, null, 2), 'utf8');

            console.log(`[CRM Export] Period export completed: ${sales.length} sales items, ${returnList.length} returns items`);

            return {
                salesCount: sales.length,
                returnsCount: returnList.length,
                files: {
                    salesAndReturns: combinedObjPath,
                    salesOnly: salesPath,
                    returnsOnly: returnsPath,
                    combinedTransactions: flatCombinedPath
                }
            };
        } catch (error) {
            console.error('[CRM Export] Error exporting period:', error);
            throw error;
        }
    }
}

export default new CrmExportService();
