import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobOrderCostsApi from "../../api/jobOrderCostsApi.jsx";

export const fetchJobOrderCosts = createAsyncThunk(
    "jobOrderCosts/fetchAll",
    async () => {
        const res = await jobOrderCostsApi.getAll();
        return res.data;
    }
);

export const fetchJobOrderCostsByJobOrder = createAsyncThunk(
    "jobOrderCosts/fetchByJobOrder",
    async (jobOrderId) => {
        const res = await jobOrderCostsApi.getByJobOrderId(jobOrderId);
        return res.data;
    }
);

export const addJobOrderCost = createAsyncThunk(
    "jobOrderCosts/add",
    async (data) => {
        const res = await jobOrderCostsApi.create(data);
        return res.data;
    }
);

export const updateJobOrderCost = createAsyncThunk(
    "jobOrderCosts/update",
    async ({ id, data }) => {
        const res = await jobOrderCostsApi.update(id, data);
        return res.data;
    }
);

export const deleteJobOrderCost = createAsyncThunk(
    "jobOrderCosts/delete",
    async (id) => {
        await jobOrderCostsApi.remove(id);
        return id;
    }
);

const slice = createSlice({
    name: "jobOrderCosts",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobOrderCosts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobOrderCosts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchJobOrderCosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchJobOrderCostsByJobOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchJobOrderCostsByJobOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchJobOrderCostsByJobOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addJobOrderCost.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateJobOrderCost.fulfilled, (state, action) => {
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(deleteJobOrderCost.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
            });
    },
});

export default slice.reducer;
