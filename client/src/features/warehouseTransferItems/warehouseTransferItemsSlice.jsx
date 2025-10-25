// src/store/warehouseTransferItemsSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseTransferItemsApi from '../api/warehouseTransferItemsApi';

export const fetchTransferItems = createAsyncThunk(
  'warehouseTransferItems/fetchTransferItems',
  async (transferId) => {
    const res = await warehouseTransferItemsApi.getByTransfer(transferId);
    return res.data;
  }
);

export const addTransferItem = createAsyncThunk(
  'warehouseTransferItems/addTransferItem',
  async (item) => {
    const res = await warehouseTransferItemsApi.create(item);
    return res.data;
  }
);

export const updateTransferItem = createAsyncThunk(
  'warehouseTransferItems/updateTransferItem',
  async ({ id, data }) => {
    const res = await warehouseTransferItemsApi.update(id, data);
    return res.data;
  }
);

export const deleteTransferItem = createAsyncThunk(
  'warehouseTransferItems/deleteTransferItem',
  async (id) => {
    await warehouseTransferItemsApi.remove(id);
    return id;
  }
);

const warehouseTransferItemsSlice = createSlice({
  name: 'warehouseTransferItems',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTransferItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransferItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransferItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransferItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTransferItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTransferItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex(i => i.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteTransferItem.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export const { clearTransferItems } = warehouseTransferItemsSlice.actions;
export default warehouseTransferItemsSlice.reducer;
