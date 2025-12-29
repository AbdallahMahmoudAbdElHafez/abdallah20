import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productTypesApi from "../../api/productTypesApi";

export const fetchProductTypes = createAsyncThunk("productTypes/fetchProductTypes", async (params) => {
    const res = await productTypesApi.getAll(params);
    return res.data;
});

export const addProductType = createAsyncThunk("productTypes/addProductType", async (data) => {
    const res = await productTypesApi.create(data);
    return res.data;
});

export const updateProductType = createAsyncThunk("productTypes/updateProductType", async ({ id, data }) => {
    const res = await productTypesApi.update(id, data);
    return res.data;
});

export const deleteProductType = createAsyncThunk("productTypes/deleteProductType", async (id) => {
    await productTypesApi.delete(id);
    return id;
});

const productTypesSlice = createSlice({
    name: "productTypes",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductTypes.pending, (state) => { state.loading = true; })
            .addCase(fetchProductTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProductTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addProductType.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateProductType.fulfilled, (state, action) => {
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteProductType.fulfilled, (state, action) => {
                state.items = state.items.filter((p) => p.id !== action.payload);
            });
    },
});

export default productTypesSlice.reducer;
