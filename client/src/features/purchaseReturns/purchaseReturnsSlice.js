import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseReturnsApi from "../../api/purchaseReturnsApi";

export const fetchPurchaseReturns = createAsyncThunk("purchaseReturns/fetchPurchaseReturns", async () => {
    const res = await purchaseReturnsApi.getAll();
    return res.data;
});

export const addPurchaseReturn = createAsyncThunk("purchaseReturns/addPurchaseReturn", async (purchaseReturn) => {
    const res = await purchaseReturnsApi.create(purchaseReturn);
    return res.data;
});

export const updatePurchaseReturn = createAsyncThunk("purchaseReturns/updatePurchaseReturn", async ({ id, data }) => {
    const res = await purchaseReturnsApi.update(id, data);
    return res.data;
});

export const deletePurchaseReturn = createAsyncThunk("purchaseReturns/deletePurchaseReturn", async (id) => {
    await purchaseReturnsApi.delete(id);
    return id;
});

const purchaseReturnsSlice = createSlice({
    name: "purchaseReturns",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseReturns.pending, (state) => { state.loading = true; })
            .addCase(fetchPurchaseReturns.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPurchaseReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addPurchaseReturn.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updatePurchaseReturn.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deletePurchaseReturn.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default purchaseReturnsSlice.reducer;
