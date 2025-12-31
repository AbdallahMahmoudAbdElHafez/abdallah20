import { createJournalEntry } from "../services/journal.service.js";
import ENTRY_TYPES from "../constants/entryTypes.js";

export default function salesInvoiceHooks(sequelize) {
    const { Party, Account, ReferenceType } = sequelize.models; // SalesInvoice is snake_case
    const SalesInvoice = sequelize.models.sales_invoices;

    SalesInvoice.afterCreate(async (invoice, options) => {
        const t = options.transaction;

        try {
            // 1. Ensure Reference Type exists
            let refType = await ReferenceType.findOne({ where: { code: 'sales_invoice' }, transaction: t });
            if (!refType) {
                refType = await ReferenceType.create({
                    code: 'sales_invoice',
                    name: 'فاتورة مبيعات',
                    label: 'فاتورة مبيعات',
                    description: 'قيود فواتير المبيعات'
                }, { transaction: t });
            }

            // 2. Identify Debit Account (Customer)
            const customer = await Party.findByPk(invoice.party_id, { transaction: t });
            if (!customer?.account_id) {
                console.warn(`SalesInvoice Hook: Customer ${invoice.party_id} has no account_id. Skipping Journal Entry.`);
                return;
            }

            // 3. Identify Account IDs (Strict)
            const CUSTOMER_ACCOUNT_ID = 47;
            const SALES_ACCOUNT_ID = 28;
            const VAT_ACCOUNT_ID = 65;
            const TAX_ACCOUNT_ID = 66; // مصلحة الضرائب
            const DISCOUNT_ALLOWED_ID = 108;

            // 4. Build Journal Entry Lines
            const lines = [
                {
                    account_id: CUSTOMER_ACCOUNT_ID,
                    debit: invoice.total_amount,
                    credit: 0,
                    description: `فاتورة مبيعات #${invoice.invoice_number}`
                },
                {
                    account_id: SALES_ACCOUNT_ID,
                    debit: 0,
                    credit: parseFloat(invoice.subtotal || 0) + parseFloat(invoice.shipping_amount || 0),
                    description: `إيرادات مبيعات (شامل الشحن) - فاتورة #${invoice.invoice_number}`
                }
            ];

            // Add VAT Line if applicable
            if (parseFloat(invoice.vat_amount) > 0) {
                lines.push({
                    account_id: VAT_ACCOUNT_ID,
                    debit: 0,
                    credit: invoice.vat_amount,
                    description: `ضريبة قيمة مضافة - فاتورة #${invoice.invoice_number}`
                });
            }

            // Add Additional Tax Line if applicable
            if (parseFloat(invoice.tax_amount) > 0) {
                lines.push({
                    account_id: TAX_ACCOUNT_ID,
                    debit: 0,
                    credit: invoice.tax_amount,
                    description: `ضرائب أخرى - فاتورة #${invoice.invoice_number}`
                });
            }

            // Add Discount Line if applicable
            if (parseFloat(invoice.additional_discount) > 0) {
                lines.push({
                    account_id: DISCOUNT_ALLOWED_ID,
                    debit: invoice.additional_discount,
                    credit: 0,
                    description: `خصم مسموح به - فاتورة #${invoice.invoice_number}`
                });
            }

            // 5. Create Journal Entry
            await createJournalEntry({
                refCode: "sales_invoice",
                refId: invoice.id,
                entryDate: invoice.invoice_date || new Date(),
                description: `فاتورة مبيعات #${invoice.invoice_number}`,
                entryTypeId: ENTRY_TYPES.SALES_INVOICE,
                lines
            }, { transaction: t });

            console.log(`Journal Entry created for Sales Invoice #${invoice.id} with ${lines.length} lines`);

        } catch (error) {
            console.error("Error creating Journal Entry for Sales Invoice:", error);
            throw error;
        }
    });
}
