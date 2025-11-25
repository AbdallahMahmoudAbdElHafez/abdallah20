import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesInvoicesApi from "../../api/salesInvoicesApi";

export const fetchSalesInvoices = createAsyncThunk("salesInvoices/fetchSalesInvoices", async () => {
    const res = await salesInvoicesApi.getAll();
    return res.data;
});

export const addSalesInvoice = createAsyncThunk("salesInvoices/addSalesInvoice", async (data) => {
    const res = await salesInvoicesApi.create(data);
    return res.data;
});

export const updateSalesInvoice = createAsyncThunk("salesInvoices/updateSalesInvoice", async ({ id, data }) => {
    const res = await salesInvoicesApi.update(id, data);
    return res.data;
});

export const deleteSalesInvoice = createAsyncThunk("salesInvoices/deleteSalesInvoice", async (id) => {
    await salesInvoicesApi.delete(id);
    return id;
});

const salesInvoicesSlice = createSlice({
    name: "salesInvoices",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesInvoices.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSalesInvoice.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesInvoice.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesInvoice.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesInvoicesSlice.reducer;
