// src/redux/purchaseInvoiceItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchInvoiceItems = createAsyncThunk(
  "purchaseInvoiceItems/fetch",
  async (invoiceId) => {
    const res = await axios.get(`http://localhost:5000/api/purchase-invoices/${invoiceId}/items`);
    return { invoiceId, items: res.data };
  }
);

export const addInvoiceItem = createAsyncThunk(
  "purchaseInvoiceItems/add",
  async ({ invoiceId, item }) => {
    const res = await axios.post(`http://localhost:5000/api/purchase-invoices/${invoiceId}/items`, item);
    return { invoiceId, item: res.data };
  }
);

export const updateInvoiceItem = createAsyncThunk(
  "purchaseInvoiceItems/update",
  async ({ invoiceId, id, item }) => {
    const res = await axios.put(`http://localhost:5000/api/purchase-invoice-items/${id}`, item);
    return { invoiceId, item: res.data };
  }
);

export const deleteInvoiceItem = createAsyncThunk(
  "purchaseInvoiceItems/delete",
  async ({ invoiceId, id }) => {
    await axios.delete(`http://localhost:5000/api/purchase-invoice-items/${id}`);
    return { invoiceId, id };
  }
);

const purchaseInvoiceItemsSlice = createSlice({
  name: "purchaseInvoiceItems",
  initialState: { byInvoice: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceItems.pending, (state) => { state.loading = true; })
      .addCase(fetchInvoiceItems.fulfilled, (state, action) => {
        state.loading = false;
        state.byInvoice[action.payload.invoiceId] = action.payload.items;
      })
      .addCase(addInvoiceItem.fulfilled, (state, action) => {
        state.byInvoice[action.payload.invoiceId].push(action.payload.item);
      })
      .addCase(updateInvoiceItem.fulfilled, (state, action) => {
        const items = state.byInvoice[action.payload.invoiceId];
        const idx = items.findIndex(i => i.id === action.payload.item.id);
        if (idx > -1) items[idx] = action.payload.item;
      })
      .addCase(deleteInvoiceItem.fulfilled, (state, action) => {
        const items = state.byInvoice[action.payload.invoiceId];
        state.byInvoice[action.payload.invoiceId] = items.filter(i => i.id !== action.payload.id);
      })
      .addCase(fetchInvoiceItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default purchaseInvoiceItemsSlice.reducer;
