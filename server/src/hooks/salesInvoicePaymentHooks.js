
export default function salesInvoicePaymentHooks(sequelize) {
    const SalesInvoicePayment = sequelize.models.sales_invoice_payments;

    SalesInvoicePayment.beforeCreate(async (payment, options) => {
        const t = options.transaction;
        // Use sequelize.models directly or via the instance
        const invoice = await payment.sequelize.models.sales_invoices.findByPk(
            payment.sales_invoice_id,
            { transaction: t }
        );
        if (!invoice) throw new Error("Invoice not found");

        const totalPaid = await payment.sequelize.models.sales_invoice_payments.sum("amount", {
            where: { sales_invoice_id: payment.sales_invoice_id },
            transaction: t
        });

        const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
        if (Number(payment.amount) > remaining) {
            throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
        }
    });
}
