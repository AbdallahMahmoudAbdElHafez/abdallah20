import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productsApi from "../../api/productsApi";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const res = await productsApi.getAll();
  return res.data;
});

export const addProduct = createAsyncThunk("products/addProduct", async (product) => {
  const res = await productsApi.create(product);
  return res.data;
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, data }) => {
  const res = await productsApi.update(id, data);
  return res.data;
});

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id) => {
  await productsApi.delete(id);
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
