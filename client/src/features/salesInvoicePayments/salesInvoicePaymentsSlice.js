import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import salesInvoicePaymentsApi from '../../api/salesInvoicePaymentsApi';

// ---- Thunks ----

// جلب جميع المدفوعات
export const fetchAllPayments = createAsyncThunk(
    'salesInvoicePayments/fetchAll',
    async (params) => {
        const { data } = await salesInvoicePaymentsApi.getAll(params);
        return data;
    }
);

// جلب المدفوعات لفاتورة محددة
export const fetchPaymentsByInvoice = createAsyncThunk(
    'salesInvoicePayments/fetchByInvoice',
    async (invoiceId) => {
        const res = await salesInvoicePaymentsApi.getAllByInvoice(invoiceId);
        return { invoiceId, payments: res.data };
    }
);

// إضافة دفعة جديدة
export const addPayment = createAsyncThunk(
    'salesInvoicePayments/addPayment',
    async (payment) => {
        const res = await salesInvoicePaymentsApi.create(payment);
        return res.data;
    }
);

// تحديث دفعة
export const updatePayment = createAsyncThunk(
    'salesInvoicePayments/updatePayment',
    async ({ id, data }) => {
        const res = await salesInvoicePaymentsApi.update(id, data);
        return res.data;
    }
);

// حذف دفعة
export const deletePayment = createAsyncThunk(
    'salesInvoicePayments/deletePayment',
    async (id) => {
        await salesInvoicePaymentsApi.delete(id);
        return id;
    }
);

// ---- Slice ----
const salesInvoicePaymentsSlice = createSlice({
    name: 'salesInvoicePayments',
    initialState: { byInvoice: {}, status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // جميع المدفوعات
            .addCase(fetchAllPayments.pending, (s) => { s.status = 'loading'; })
            .addCase(fetchAllPayments.fulfilled, (s, a) => {
                s.status = 'succeeded';
                s.byInvoice.all = a.payload;
            })
            .addCase(fetchAllPayments.rejected, (s, a) => {
                s.status = 'failed';
                s.error = a.error.message;
            })

            // مدفوعات فاتورة محددة
            .addCase(fetchPaymentsByInvoice.pending, (s) => { s.status = 'loading'; })
            .addCase(fetchPaymentsByInvoice.fulfilled, (s, a) => {
                s.status = 'succeeded';
                s.byInvoice[a.payload.invoiceId] = a.payload.payments;
            })
            .addCase(fetchPaymentsByInvoice.rejected, (s, a) => {
                s.status = 'failed'; s.error = a.error.message;
            })

            // إضافة
            .addCase(addPayment.fulfilled, (s, a) => {
                const invId = a.payload.sales_invoice_id;
                if (!s.byInvoice[invId]) s.byInvoice[invId] = [];
                s.byInvoice[invId].push(a.payload);
            })

            // تحديث
            .addCase(updatePayment.fulfilled, (s, a) => {
                const invId = a.payload.sales_invoice_id;
                const idx = s.byInvoice[invId]?.findIndex(p => p.id === a.payload.id);
                if (idx !== -1) s.byInvoice[invId][idx] = a.payload;
            })

            // حذف
            .addCase(deletePayment.fulfilled, (s, a) => {
                for (const invId in s.byInvoice) {
                    s.byInvoice[invId] = s.byInvoice[invId].filter(p => p.id !== a.payload);
                }
            });
    },
});

export default salesInvoicePaymentsSlice.reducer;
