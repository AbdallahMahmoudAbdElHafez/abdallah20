import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseInvoiceItemsApi from "../../api/purchaseInvoiceItemsApi";

export const fetchItemsByOrder = createAsyncThunk(
  "purchaseInvoiceItems/fetchByOrder",
  async (orderId) => {
    const res = await purchaseInvoiceItemsApi.getAllByInvoice(orderId);
    return res.data;
  }
);

export const createItem = createAsyncThunk(
  "purchaseInvoiceItems/create",
  async (item) => {
    // استبعاد أي id حتى لا يحدث Duplicate Key
    const { id, ...cleanItem } = item;
    const res = await purchaseInvoiceItemsApi.create(cleanItem);
    return res.data;
  }
);

export const updateItem = createAsyncThunk(
  "purchaseInvoiceItems/update",
  async ({ id, data }) => {
    const res = await purchaseInvoiceItemsApi.update(id, data);
    return res.data;
  }
);

export const deleteItem = createAsyncThunk(
  "purchaseInvoiceItems/delete",
  async (id) => {
    await purchaseInvoiceItemsApi.delete(id);
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
