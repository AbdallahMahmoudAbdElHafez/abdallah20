import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseReturnItemsApi from "../../api/PurchaseReturnItemsApi";

export const fetchPurchaseReturnItems = createAsyncThunk(
    "purchaseReturnItems/fetchPurchaseReturnItems",
    async () => {
        const res = await purchaseReturnItemsApi.getAll();
        return res.data;
    }
);

export const createPurchaseReturnItem = createAsyncThunk(
    "purchaseReturnItems/createPurchaseReturnItem",
    async (item) => {
        const res = await purchaseReturnItemsApi.create(item);
        return res.data;
    }
);

export const updatePurchaseReturnItem = createAsyncThunk(
    "purchaseReturnItems/updatePurchaseReturnItem",
    async ({ id, data }) => {
        const res = await purchaseReturnItemsApi.update(id, data);
        return res.data;
    }
);

export const deletePurchaseReturnItem = createAsyncThunk(
    "purchaseReturnItems/deletePurchaseReturnItem",
    async (id) => {
        await purchaseReturnItemsApi.delete(id);
        return id;
    }
);

const purchaseReturnItemsSlice = createSlice({
    name: "purchaseReturnItems",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchaseReturnItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPurchaseReturnItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPurchaseReturnItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPurchaseReturnItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updatePurchaseReturnItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deletePurchaseReturnItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default purchaseReturnItemsSlice.reducer;
