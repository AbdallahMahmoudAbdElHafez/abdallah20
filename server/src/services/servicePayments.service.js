import { sequelize, ServicePayment, ExternalServiceInvoice, Party, Cheque, Account, ReferenceType, Employee } from "../models/index.js";
import { createJournalEntry } from "./journal.service.js";
import { Op } from "sequelize";

const ServicePaymentsService = {
  getAll: async (filters = {}) => {
    const where = {};
    if (filters.external_service_invoice_id) where.external_service_invoice_id = filters.external_service_invoice_id;

    if (filters.startDate && filters.endDate) {
      where.payment_date = {
        [Op.between]: [filters.startDate, filters.endDate]
      };
    } else if (filters.startDate) {
      where.payment_date = {
        [Op.gte]: filters.startDate
      };
    } else if (filters.endDate) {
      where.payment_date = {
        [Op.lte]: filters.endDate
      };
    }

    return await ServicePayment.findAll({
      where,
      include: [
        { 
            model: ExternalServiceInvoice, 
            as: 'invoice',
            include: [{ model: Party, as: 'party' }]
        },
        { model: Account, as: 'account' },
        { model: Employee, as: 'employee' }
      ],
      order: [['payment_date', 'DESC']]
    });
  },

  getById: async (id) => {
    return await ServicePayment.findByPk(id, {
      include: [
        { model: Account, as: 'account' },
        { model: Employee, as: 'employee' }
      ]
    });
  },

  create: async (data) => {
    if (data.employee_id === '') data.employee_id = null;
    if (data.account_id === '') delete data.account_id;

    const t = await sequelize.transaction();
    try {
      const invoice = await ExternalServiceInvoice.findByPk(data.external_service_invoice_id, {
        include: [{ model: Party, as: "party" }],
        transaction: t,
      });

      if (!invoice) throw new Error("Invoice not found");
      if (invoice.status === 'Draft' || invoice.status === 'Cancelled') {
          throw new Error("Cannot add payment to Draft or Cancelled invoice");
      }

      if (!data.amount || isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
        throw new Error("Invalid payment amount");
      }

      const totalPaid = await ServicePayment.sum("amount", {
        where: { external_service_invoice_id: invoice.id },
        transaction: t,
      });

      const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
      if (Number(data.amount) > remaining) {
        throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
      }

      const payment = await ServicePayment.create(data, { transaction: t });

      if (!invoice.party?.account_id) {
        throw new Error("Supplier does not have a linked account_id");
      }

      if (data.payment_method === 'cheque') {
          if (!data.cheque_number || !data.due_date) {
              throw new Error("Cheque number and Due Date are required for cheque payments");
          }
          await Cheque.create({
              cheque_number: data.cheque_number,
              cheque_type: 'outgoing',
              amount: data.amount,
              service_payment_id: payment.id,
              account_id: data.account_id,
              issue_date: data.issue_date || data.payment_date,
              due_date: data.due_date,
              status: 'issued'
          }, { transaction: t });
      }

      let refType = await ReferenceType.findOne({ where: { code: 'service_payment' }, transaction: t });
      if (!refType) {
        refType = await ReferenceType.create({
          code: 'service_payment',
          label: 'سداد خدمات',
          name: 'سداد خدمات',
          description: 'Journal Entry for Service Payment (Settlement)'
        }, { transaction: t });
      }

      await createJournalEntry(
        {
          refCode: "service_payment",
          refId: payment.id,
          entryDate: payment.payment_date,
          description: `سداد فاتورة خدمة #${invoice.invoice_no || invoice.id} - ${data.payment_method}`,
          lines: [
            {
              account_id: invoice.party.account_id,
              debit: Number(data.amount),
              credit: 0,
              description: "تخفيض التزامات المورد (خدمات)",
            },
            {
              account_id: data.account_id,
              debit: 0,
              credit: Number(data.amount),
              description: `خروج - ${data.payment_method}`,
            },
          ],
          entryTypeId: 1 // Default type or a specific one if needed
        },
        { transaction: t }
      );

      const newPaid = Number(totalPaid || 0) + Number(data.amount);
      const newStatus =
        newPaid >= Number(invoice.total_amount)
          ? "Paid"
          : newPaid > 0
            ? "Partially Paid"
            : invoice.status;

      if (newStatus !== invoice.status) {
        await invoice.update({ status: newStatus }, { transaction: t });
      }

      await t.commit();
      return payment;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  update: async (id, data) => {
    if (data.employee_id === '') data.employee_id = null;
    if (data.account_id === '') delete data.account_id;

    const t = await sequelize.transaction();
    try {
      const payment = await ServicePayment.findByPk(id, { transaction: t });
      if (!payment) throw new Error("Payment not found");

      if (data.amount !== undefined) {
        const invoice = await ExternalServiceInvoice.findByPk(payment.external_service_invoice_id, {
          transaction: t,
        });
        const totalPaid = await ServicePayment.sum("amount", {
          where: {
            external_service_invoice_id: invoice.id,
            id: { [Op.ne]: id },
          },
          transaction: t,
        });
        const remaining = Number(invoice.total_amount) - Number(totalPaid || 0);
        if (Number(data.amount) > remaining) {
          throw new Error(`Payment exceeds remaining amount. Remaining: ${remaining}`);
        }
      }

      await payment.update(data, { transaction: t });

      const totalAfter = await ServicePayment.sum("amount", {
        where: { external_service_invoice_id: payment.external_service_invoice_id },
        transaction: t,
      });
      const invoice = await ExternalServiceInvoice.findByPk(payment.external_service_invoice_id, { transaction: t });
      const newStatus =
        totalAfter >= invoice.total_amount
          ? "Paid"
          : totalAfter > 0
            ? "Partially Paid"
            : invoice.status;
      if (newStatus !== invoice.status) {
        await invoice.update({ status: newStatus }, { transaction: t });
      }

      await t.commit();
      return payment;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  remove: async (id) => {
    const t = await sequelize.transaction();
    try {
        const payment = await ServicePayment.findByPk(id, { transaction: t });
        if (!payment) return null;
        
        const invoiceId = payment.external_service_invoice_id;
        
        await payment.destroy({ transaction: t });
        
        // Update Invoice status
        const totalAfter = await ServicePayment.sum("amount", {
            where: { external_service_invoice_id: invoiceId },
            transaction: t,
        });
        const invoice = await ExternalServiceInvoice.findByPk(invoiceId, { transaction: t });
        const newStatus =
            totalAfter >= invoice.total_amount
            ? "Paid"
            : totalAfter > 0
                ? "Partially Paid"
                : "Posted"; // Default to Posted since Drafts can't have payments

        if (newStatus !== invoice.status) {
            await invoice.update({ status: newStatus }, { transaction: t });
        }

        await t.commit();
        return { message: 'Deleted successfully' };
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }
};

export default ServicePaymentsService;
