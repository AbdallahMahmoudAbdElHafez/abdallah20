// src/store/billOfMaterialsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import billOfMaterialsApi from '../../api/billOfMaterialsApi.jsx';

export const loadBOM = createAsyncThunk('bom/load', async (params) => {
  return billOfMaterialsApi.fetchBOM(params);
});
export const addBOM = createAsyncThunk('bom/add', async (payload) => {
  return billOfMaterialsApi.createBOM(payload);
});
export const editBOM = createAsyncThunk('bom/edit', async ({id, payload}) => {
  return billOfMaterialsApi.updateBOM(id, payload);
});
export const removeBOM = createAsyncThunk('bom/remove', async (id) => {
  return billOfMaterialsApi.deleteBOM(id);
});

const slice = createSlice({
  name: 'billOfMaterials',
  initialState: { items: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(loadBOM.pending, state => { state.loading = true; state.error = null; })
      .addCase(loadBOM.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(loadBOM.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addBOM.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(editBOM.fulfilled, (state, action) => {
        const idx = state.items.findIndex(i => i.id === action.payload.id);
        if (idx>=0) state.items[idx] = action.payload;
      })
      .addCase(removeBOM.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.meta.arg);
      });
  }
});

export default slice.reducer;
