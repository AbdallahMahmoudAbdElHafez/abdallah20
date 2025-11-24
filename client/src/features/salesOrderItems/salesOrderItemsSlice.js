import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesOrderItemsApi from "../../api/salesOrderItemsApi";

export const fetchSalesOrderItems = createAsyncThunk("salesOrderItems/fetchSalesOrderItems", async (params) => {
    const res = await salesOrderItemsApi.getAll(params);
    return res.data;
});

export const addSalesOrderItem = createAsyncThunk("salesOrderItems/addSalesOrderItem", async (data) => {
    const res = await salesOrderItemsApi.create(data);
    return res.data;
});

export const updateSalesOrderItem = createAsyncThunk("salesOrderItems/updateSalesOrderItem", async ({ id, data }) => {
    const res = await salesOrderItemsApi.update(id, data);
    return res.data;
});

export const deleteSalesOrderItem = createAsyncThunk("salesOrderItems/deleteSalesOrderItem", async (id) => {
    await salesOrderItemsApi.delete(id);
    return id;
});

const salesOrderItemsSlice = createSlice({
    name: "salesOrderItems",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesOrderItems.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesOrderItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesOrderItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSalesOrderItem.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesOrderItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesOrderItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesOrderItemsSlice.reducer;
