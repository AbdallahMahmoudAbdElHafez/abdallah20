import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesInvoiceItemsApi from "../../api/salesInvoiceItemsApi";

export const fetchSalesInvoiceItems = createAsyncThunk("salesInvoiceItems/fetchSalesInvoiceItems", async (filters) => {
    const res = await salesInvoiceItemsApi.getAll(filters);
    return res.data;
});

export const addSalesInvoiceItem = createAsyncThunk("salesInvoiceItems/addSalesInvoiceItem", async (data) => {
    const res = await salesInvoiceItemsApi.create(data);
    return res.data;
});

export const updateSalesInvoiceItem = createAsyncThunk("salesInvoiceItems/updateSalesInvoiceItem", async ({ id, data }) => {
    const res = await salesInvoiceItemsApi.update(id, data);
    return res.data;
});

export const deleteSalesInvoiceItem = createAsyncThunk("salesInvoiceItems/deleteSalesInvoiceItem", async (id) => {
    await salesInvoiceItemsApi.delete(id);
    return id;
});

const salesInvoiceItemsSlice = createSlice({
    name: "salesInvoiceItems",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesInvoiceItems.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesInvoiceItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesInvoiceItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSalesInvoiceItem.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesInvoiceItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesInvoiceItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesInvoiceItemsSlice.reducer;
