import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseInvoicesApi from "../../api/purchaseInvoicesApi";

// 👇 نمرر باراميتر اختياري للفلترة
export const fetchPurchaseInvoices = createAsyncThunk(
  "purchaseInvoices/fetchPurchaseInvoices",
  async (params = {}) => {
    const res = await purchaseInvoicesApi.getAll(params);
    return res.data;
  }
);

export const addPurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/addPurchaseInvoice",
  async (purchaseInvoice) => {
    const res = await purchaseInvoicesApi.create(purchaseInvoice);
    return res.data;
  }
);

export const updatePurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/updatePurchaseInvoice",
  async ({ id, data }) => {
    const res = await purchaseInvoicesApi.update(id, data);
    return res.data;
  }
);

export const deletePurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/deletePurchaseInvoice",
  async (id) => {
    await purchaseInvoicesApi.delete(id);
    return id;
  }
);

const purchaseInvoicesSlice = createSlice({
  name: "purchaseInvoices",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseInvoices.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchPurchaseInvoices.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPurchaseInvoices.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(addPurchaseInvoice.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePurchaseInvoice.fulfilled, (state, action) => {
        const i = state.items.findIndex((inv) => inv.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deletePurchaseInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((inv) => inv.id !== action.payload);
      });
  },
});

export default purchaseInvoicesSlice.reducer;
