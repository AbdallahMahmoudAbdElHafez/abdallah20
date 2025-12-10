import { createJournalEntry } from "../services/journal.service.js";

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

            // 3. Identify Credit Account (Revenue/Sales)
            let salesAccountId = invoice.account_id;
            if (!salesAccountId) {
                const salesAccount = await Account.findOne({ where: { name: 'المبيعات' }, transaction: t });
                if (salesAccount) {
                    salesAccountId = salesAccount.id;
                }
            }

            if (!salesAccountId) {
                console.warn(`SalesInvoice Hook: No Sales Account found (id or name 'المبيعات'). Skipping Journal Entry.`);
                return;
            }

            // 4. Create Journal Entry
            await createJournalEntry({
                refCode: "sales_invoice",
                refId: invoice.id,
                entryDate: invoice.invoice_date || new Date(),
                description: `فاتورة مبيعات #${invoice.invoice_number}`,
                lines: [
                    {
                        account_id: customer.account_id,
                        debit: invoice.total_amount,
                        credit: 0,
                        description: `فاتورة مبيعات #${invoice.invoice_number}`
                    },
                    {
                        account_id: salesAccountId,
                        debit: 0,
                        credit: invoice.total_amount,
                        description: `إيرادات مبيعات - فاتورة #${invoice.invoice_number}`
                    }
                ]
            }, { transaction: t });

            console.log(`Journal Entry created for Sales Invoice #${invoice.id}`);

        } catch (error) {
            console.error("Error creating Journal Entry for Sales Invoice:", error);
            throw error;
        }
    });
}
