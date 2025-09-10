import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseOrdersApi from "../../api/purchaseOrdersApi";

export const fetchPurchaseOrders = createAsyncThunk("purchaseOrders/fetchPurchaseOrders", async () => {
  const res = await purchaseOrdersApi.getAll();
  return res.data;
});

export const addPurchaseOrder = createAsyncThunk("purchaseOrders/addPurchaseOrder", async (purchaseOrder) => {
  const res = await purchaseOrdersApi.create(purchaseOrder);
  return res.data;
});

export const updatePurchaseOrder = createAsyncThunk("purchaseOrders/updatePurchaseOrder", async ({ id, data }) => {
  const res = await purchaseOrdersApi.update(id, data);
  return res.data;
});
export const deletePurchaseOrder = createAsyncThunk("purchaseOrders/deletePurchaseOrder", async (id) => {
  await purchaseOrdersApi.delete(id);
  return id;
});
const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState: { items: [], loading: false, error: null }, 
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
      .addCase(addPurchaseOrder.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex((po) => po.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((po) => po.id !== action.payload);
      });
  },
});
export default purchaseOrdersSlice.reducer;

