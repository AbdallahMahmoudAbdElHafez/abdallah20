// src/features/cheques/chequesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supplierChequesApi from '../../api/supplierChequesApi';

export const fetchCheques = createAsyncThunk(
  'cheques/fetch',
  async () => {
    const res = await supplierChequesApi.getAll();
    return res.data;
  }
);

export const addCheque = createAsyncThunk(
  'cheques/add',
  async (data) => {
    const res = await supplierChequesApi.create(data);
    return res.data;
  }
);

export const updateCheque = createAsyncThunk(
  'cheques/update',
  async ({ id, data }) => {
    const res = await supplierChequesApi.update(id, data);
    return res.data;
  }
);

export const deleteCheque = createAsyncThunk(
  'cheques/delete',
  async (id) => {
    await supplierChequesApi.delete(id);
    return id;
  }
);

const chequesSlice = createSlice({
  name: 'cheques',
  initialState: {  byInvoice: {}, items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheques.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchCheques.fulfilled, (s, a) => {
        s.status = 'succeeded'; s.items = a.payload;
      })
      .addCase(fetchCheques.rejected, (s, a) => {
        s.status = 'failed'; s.error = a.error.message;
      })
      .addCase(addCheque.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(updateCheque.fulfilled, (s, a) => {
        const i = s.items.findIndex(c => c.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(deleteCheque.fulfilled, (s, a) => {
        s.items = s.items.filter(c => c.id !== a.payload);
      });
  },
});

export default chequesSlice.reducer;
