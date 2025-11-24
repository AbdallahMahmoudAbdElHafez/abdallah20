import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesOrdersApi from "../../api/salesOrdersApi";

export const fetchSalesOrders = createAsyncThunk("salesOrders/fetchSalesOrders", async () => {
    const res = await salesOrdersApi.getAll();
    return res.data;
});

export const addSalesOrder = createAsyncThunk("salesOrders/addSalesOrder", async (data) => {
    const res = await salesOrdersApi.create(data);
    return res.data;
});

export const updateSalesOrder = createAsyncThunk("salesOrders/updateSalesOrder", async ({ id, data }) => {
    const res = await salesOrdersApi.update(id, data);
    return res.data;
});

export const deleteSalesOrder = createAsyncThunk("salesOrders/deleteSalesOrder", async (id) => {
    await salesOrdersApi.delete(id);
    return id;
});

const salesOrdersSlice = createSlice({
    name: "salesOrders",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSalesOrder.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesOrder.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesOrder.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesOrdersSlice.reducer;
