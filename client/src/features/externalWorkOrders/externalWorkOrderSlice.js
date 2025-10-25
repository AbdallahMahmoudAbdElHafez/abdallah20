import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import externalWorkOrdersApi from '../../api/externalWorkOrdersApi';

export const fetchExternalWorkOrders = createAsyncThunk(
    'externalWorkOrders/fetchAll',
    async () => {
        const res = await externalWorkOrdersApi.getAll();
        return res.data;
    }
);

export const createExternalWorkOrder = createAsyncThunk(
    'externalWorkOrders/create',
    async (data, { dispatch }) => {
        await externalWorkOrdersApi.create(data);
        dispatch(fetchExternalWorkOrders());
    }
);

export const deleteExternalWorkOrder = createAsyncThunk(
    'externalWorkOrders/delete',
    async (id, { dispatch }) => {
        await externalWorkOrdersApi.delete(id);
        dispatch(fetchExternalWorkOrders());
    }
);

const externalWorkOrdersSlice = createSlice({
    name: 'externalWorkOrders',
    initialState: { list: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExternalWorkOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchExternalWorkOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchExternalWorkOrders.rejected, (state) => { state.loading = false; });
    },
});

export default externalWorkOrdersSlice.reducer;