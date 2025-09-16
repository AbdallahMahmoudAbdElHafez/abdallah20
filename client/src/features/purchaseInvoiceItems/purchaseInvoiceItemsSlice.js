// features/purchaseInvoiceItems/purchaseInvoiceItemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseInvoiceItemsApi from "../../api/purchaseInvoiceItemsApi";

// 🟢 جلب جميع العناصر حسب رقم الفاتورة
export const fetchItemsByInvoice = createAsyncThunk(
  "purchaseInvoiceItems/fetchByInvoice",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await purchaseInvoiceItemsApi.getAllByInvoice(invoiceId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🟢 إنشاء عنصر جديد
export const createItem = createAsyncThunk(
  "purchaseInvoiceItems/create",
  async (item, { rejectWithValue }) => {
    try {
      const { id, ...cleanItem } = item; // استبعاد id لتفادي duplicate
      const res = await purchaseInvoiceItemsApi.create(cleanItem);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🟢 تحديث عنصر
export const updateItem = createAsyncThunk(
  "purchaseInvoiceItems/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await purchaseInvoiceItemsApi.update(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🟢 حذف عنصر
export const deleteItem = createAsyncThunk(
  "purchaseInvoiceItems/delete",
  async (id, { rejectWithValue }) => {
    try {
      await purchaseInvoiceItemsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
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
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchItemsByInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemsByInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemsByInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Delete
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearItems } = purchaseInvoiceItemsSlice.actions;
export default purchaseInvoiceItemsSlice.reducer;
