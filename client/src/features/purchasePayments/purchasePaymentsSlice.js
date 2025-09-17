// src/features/payments/paymentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import purchasePaymentsApi from '../../api/purchasePaymentsApi';

export const fetchPaymentsByInvoice = createAsyncThunk(
  'payments/fetchByInvoice',
  async (invoiceId) => {
    const res = await purchasePaymentsApi.getAllByInvoice(invoiceId);
    return { invoiceId, payments: res.data };
  }
);

export const addPayment = createAsyncThunk(
  'payments/addPayment',
  async (payment) => {
    const res = await purchasePaymentsApi.create(payment);
    return res.data;
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ id, data }) => {
    const res = await purchasePaymentsApi.update(id, data);
    return res.data;
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id) => {
    await purchasePaymentsApi.delete(id);
    return id;
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: { byInvoice: {}, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentsByInvoice.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchPaymentsByInvoice.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.byInvoice[a.payload.invoiceId] = a.payload.payments;
      })
      .addCase(fetchPaymentsByInvoice.rejected, (s, a) => {
        s.status = 'failed'; s.error = a.error.message;
      })
      .addCase(addPayment.fulfilled, (s, a) => {
        const invId = a.payload.purchase_invoice_id;
        if (!s.byInvoice[invId]) s.byInvoice[invId] = [];
        s.byInvoice[invId].push(a.payload);
      })
      .addCase(updatePayment.fulfilled, (s, a) => {
        const invId = a.payload.purchase_invoice_id;
        const idx = s.byInvoice[invId]?.findIndex(p => p.id === a.payload.id);
        if (idx !== -1) s.byInvoice[invId][idx] = a.payload;
      })
      .addCase(deletePayment.fulfilled, (s, a) => {
        for (const invId in s.byInvoice) {
          s.byInvoice[invId] = s.byInvoice[invId].filter(p => p.id !== a.payload);
        }
      });
  },
});

export default paymentsSlice.reducer;
