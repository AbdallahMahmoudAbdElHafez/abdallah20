// controllers/purchasePayment.controller.js
import * as paymentService from "../services/purchasePayment.service.js";
import { Account } from "../models/index.js";
export async function createPayment(req, res, next) {
  console.log(req.body)
  try {
    const { account_id } = req.body;

    // ✅ تأكد أن الحساب من نوع Asset (مثلاً) أو يقع تحت كاش/بنك
    const account = await Account.findByPk(account_id);
    if (!account) return res.status(400).json({ message: "Invalid account" });

    // يمرر الـ req.user?.id لو عندك مستخدم
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
}

export async function getPayments(req, res, next) {
  try {
    const list = await paymentService.listPayments(req.params.invoiceId);
    res.json(list);
  } catch (err) {
    next(err);
  }
}

export async function getPaymentDetail(req, res, next) {
  try {
    const payment = await paymentService.getPaymentById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    next(err);
  }
}
