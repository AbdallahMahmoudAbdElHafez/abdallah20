// controllers/purchasePayment.controller.js
import * as paymentService from "../services/purchasePayment.service.js";

export async function createPayment(req, res, next) {
  try {
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
