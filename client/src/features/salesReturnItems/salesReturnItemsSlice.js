import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesReturnItemsApi from "../../api/salesReturnItemsApi";

export const fetchSalesReturnItems = createAsyncThunk("salesReturnItems/fetchSalesReturnItems", async () => {
    const res = await salesReturnItemsApi.getAll();
    return res.data;
});

export const createSalesReturnItem = createAsyncThunk("salesReturnItems/createSalesReturnItem", async (data) => {
    const res = await salesReturnItemsApi.create(data);
    return res.data;
});

export const updateSalesReturnItem = createAsyncThunk("salesReturnItems/updateSalesReturnItem", async ({ id, data }) => {
    const res = await salesReturnItemsApi.update(id, data);
    return res.data;
});

export const deleteSalesReturnItem = createAsyncThunk("salesReturnItems/deleteSalesReturnItem", async (id) => {
    await salesReturnItemsApi.delete(id);
    return id;
});

const salesReturnItemsSlice = createSlice({
    name: "salesReturnItems",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesReturnItems.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesReturnItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesReturnItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createSalesReturnItem.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesReturnItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesReturnItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesReturnItemsSlice.reducer;
