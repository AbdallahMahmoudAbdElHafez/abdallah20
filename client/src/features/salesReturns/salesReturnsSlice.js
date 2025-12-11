import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salesReturnsApi from "../../api/salesReturnsApi";

export const fetchSalesReturns = createAsyncThunk("salesReturns/fetchSalesReturns", async () => {
    const res = await salesReturnsApi.getAll();
    return res.data;
});

export const addSalesReturn = createAsyncThunk("salesReturns/addSalesReturn", async (salesReturn) => {
    const res = await salesReturnsApi.create(salesReturn);
    return res.data;
});

export const updateSalesReturn = createAsyncThunk("salesReturns/updateSalesReturn", async ({ id, data }) => {
    const res = await salesReturnsApi.update(id, data);
    return res.data;
});

export const deleteSalesReturn = createAsyncThunk("salesReturns/deleteSalesReturn", async (id) => {
    await salesReturnsApi.delete(id);
    return id;
});

const salesReturnsSlice = createSlice({
    name: "salesReturns",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSalesReturns.pending, (state) => { state.loading = true; })
            .addCase(fetchSalesReturns.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSalesReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addSalesReturn.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateSalesReturn.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteSalesReturn.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default salesReturnsSlice.reducer;
