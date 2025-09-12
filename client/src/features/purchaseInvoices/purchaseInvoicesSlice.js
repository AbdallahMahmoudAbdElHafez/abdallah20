import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseInvoicesApi from "../../api/purchaseInvoicesApi";

export const fetchPurchaseInvoices = createAsyncThunk("purchaseInvoices/fetchPurchaseInvoices", async () => {
  const res = await purchaseInvoicesApi.getAll();
  return res.data;
});

export const addPurchaseInvoice = createAsyncThunk("purchaseInvoices/addPurchaseInvoice", async (purchaseInvoice) => {
  const res = await purchaseInvoicesApi.create(purchaseInvoice);
  return res.data;
});

export const updatePurchaseInvoice = createAsyncThunk("purchaseInvoices/updatePurchaseInvoice", async ({ id, data }) => {
  const res = await purchaseInvoicesApi.update(id, data);
  return res.data;
});
export const deletePurchaseInvoice = createAsyncThunk("purchaseInvoices/deletePurchaseInvoice", async (id) => {
  await purchaseInvoicesApi.delete(id);
  return id;
});
const purchaseInvoicesSlice = createSlice({
  name: "purchaseInvoices",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseInvoices.pending, (state) => { state.loading = true; })
      .addCase(fetchPurchaseInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPurchaseInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
      .addCase(addPurchaseInvoice.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updatePurchaseInvoice.fulfilled, (state, action) => {
        const index = state.items.findIndex((po) => po.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePurchaseInvoice.fulfilled, (state, action) => {
        state.items = state.items.filter((po) => po.id !== action.payload);
      });
  },
});
export default purchaseInvoicesSlice.reducer;

