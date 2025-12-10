
export default function purchaseInvoicePaymentHooks(sequelize) {
  const { PurchaseInvoicePayment } = sequelize.models;

  PurchaseInvoicePayment.beforeCreate(async (payment, options) => {
    const t = options.transaction;
    const invoice = await payment.sequelize.models.PurchaseInvoice.findByPk(
      payment.purchase_invoice_id,
      { transaction: t }
    );
    if (!invoice) throw new Error("Invoice not found");

    const totalPaid = await payment.sequelize.models.PurchaseInvoicePayment.sum("amount", {
      where: { purchase_invoice_id: payment.purchase_invoice_id },
      transaction: t
    });

    const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
    if (Number(payment.amount) > remaining) {
      throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
    }
  });
}