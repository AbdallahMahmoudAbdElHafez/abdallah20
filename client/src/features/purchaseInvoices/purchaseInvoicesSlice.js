// src/redux/purchaseInvoicesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "http://localhost:5000/api/purchase-invoices";

export const fetchPurchaseInvoices = createAsyncThunk(
  "purchaseInvoices/fetchAll",
  async () => {
    const res = await axios.get(API_URL);
    return res.data.data; // backend بيرجع { data, total, ... }
  }
);
export const createPurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/create",
  async ({ invoice, items }) => {
    // 1) إنشاء الفاتورة
    const res = await axios.post(API_URL, invoice);
    const invoiceId = res.data.id;

    // 2) إضافة البنود
    for (const item of items) {
      await axios.post(`http://localhost:5000/api/purchase-invoices/${invoiceId}/items`, item);
    }

    // 3) استرجاع الفاتورة كاملة مع البنود
    const fullInvoice = await axios.get(`${API_URL}/${invoiceId}`);
    return fullInvoice.data;
  }
);

const purchaseInvoicesSlice = createSlice({
  name: "purchaseInvoices",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPurchaseInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })  .addCase(createPurchaseInvoice.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createPurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });;
  },
});








export default purchaseInvoicesSlice.reducer;
