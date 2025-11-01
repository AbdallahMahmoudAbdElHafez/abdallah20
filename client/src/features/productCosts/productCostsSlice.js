import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productCostsApi from "../../api/productCostsApi";

export const fetchProductCosts = createAsyncThunk('productCosts/fetchAll', async () => {
  const res = await productCostsApi.getAll();
  return res.data;
});

export const createProductCost = createAsyncThunk('productCosts/create', async (data) => {
  const res = await productCostsApi.create(data);
  return res.data;
});

export const updateProductCost = createAsyncThunk('productCosts/update', async ({ id, data }) => {
  const res = await productCostsApi.update(id, data);
  return res.data;
});

export const deleteProductCost = createAsyncThunk('productCosts/delete', async (id) => {
  await productCostsApi.delete(id);
  return id;
});

const productCostsSlice = createSlice({
  name: 'productCosts',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCosts.pending, (s) => { s.loading = true; })
      .addCase(fetchProductCosts.fulfilled, (s, a) => { s.list = a.payload; s.loading = false; })
      .addCase(createProductCost.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updateProductCost.fulfilled, (s, a) => {
        const i = s.list.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      })
      .addCase(deleteProductCost.fulfilled, (s, a) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default productCostsSlice.reducer;
