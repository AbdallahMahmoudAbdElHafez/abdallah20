import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseInIvoicetemsApi from "../../api/purchaseInvoiceItemsApi";

export const fetchItemsByOrder = createAsyncThunk(
  "purchaseInvoiceItems/fetchByOrder",
  async (orderId) => {
    const res = await purchaseInIvoicetemsApi.getAllByInvoice(orderId);
    console.log(res)
   
    return res.data;
  }
);

export const createItem = createAsyncThunk(
  "purchaseInvoiceItems/create",
  async (item) => {
    const res = await purchaseInIvoicetemsApi.create(item);
    return res.data;
  }
);

export const updateItem = createAsyncThunk(
  "purchaseInvoiceItems/update",
  async ({ id, data }) => {
    const res = await purchaseInIvoicetemsApi.update(id, data);
    return res.data;
  }
);

export const deleteItem = createAsyncThunk(
  "purchaseInvoiceItems/delete",
  async (id) => {
    await purchaseInIvoicetemsApi.delete(id);
    return id;
  }
);

const purchaseInvoiceItemsSlice = createSlice({
  name: "purchaseInvoiceItems",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsByOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemsByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearItems } = purchaseInvoiceItemsSlice.actions;
export default purchaseInvoiceItemsSlice.reducer;
