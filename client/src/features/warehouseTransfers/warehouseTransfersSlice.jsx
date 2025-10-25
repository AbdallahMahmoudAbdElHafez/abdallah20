// src/features/warehouseTransfers/warehouseTransfersSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchWarehouseTransfers,
  createWarehouseTransfer,
  updateWarehouseTransfer,
  deleteWarehouseTransfer,
} from '../../api/warehouseTransfersApi';

export const loadTransfers = createAsyncThunk('warehouseTransfers/load', async (_, thunkAPI) => {
  try {
    const res = await fetchWarehouseTransfers();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const addTransfer = createAsyncThunk('warehouseTransfers/add', async (payload, thunkAPI) => {
  try {
    const res = await createWarehouseTransfer(payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const editTransfer = createAsyncThunk('warehouseTransfers/edit', async ({ id, payload }, thunkAPI) => {
  try {
    const res = await updateWarehouseTransfer(id, payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

export const removeTransfer = createAsyncThunk('warehouseTransfers/remove', async (id, thunkAPI) => {
  try {
    await deleteWarehouseTransfer(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

const slice = createSlice({
  name: 'warehouseTransfers',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadTransfers.pending, (s) => { s.status = 'loading'; })
      .addCase(loadTransfers.fulfilled, (s, a) => { s.status = 'succeeded'; s.list = a.payload; })
      .addCase(loadTransfers.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })

      .addCase(addTransfer.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(addTransfer.rejected, (s, a) => { s.error = a.payload; })

      .addCase(editTransfer.fulfilled, (s, a) => {
        const idx = s.list.findIndex((x) => x.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(editTransfer.rejected, (s, a) => { s.error = a.payload; })

      .addCase(removeTransfer.fulfilled, (s, a) => { s.list = s.list.filter((x) => x.id !== a.payload); })
      .addCase(removeTransfer.rejected, (s, a) => { s.error = a.payload; });
  },
});

export default slice.reducer;
