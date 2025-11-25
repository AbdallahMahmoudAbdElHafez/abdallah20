import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import batchesApi from "../../api/batchesApi";

export const fetchBatches = createAsyncThunk("batches/fetchBatches", async () => {
    const res = await batchesApi.getAll();
    return res.data;
});

export const addBatch = createAsyncThunk("batches/addBatch", async (batch) => {
    const res = await batchesApi.create(batch);
    return res.data;
});

export const updateBatch = createAsyncThunk("batches/updateBatch", async ({ id, data }) => {
    const res = await batchesApi.update(id, data);
    return res.data;
});

export const deleteBatch = createAsyncThunk("batches/deleteBatch", async (id) => {
    await batchesApi.delete(id);
    return id;
});

const batchesSlice = createSlice({
    name: "batches",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBatches.pending, (state) => { state.loading = true; })
            .addCase(fetchBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addBatch.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateBatch.fulfilled, (state, action) => {
                const index = state.items.findIndex((b) => b.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteBatch.fulfilled, (state, action) => {
                state.items = state.items.filter((b) => b.id !== action.payload);
            });
    },
});

export default batchesSlice.reducer;
