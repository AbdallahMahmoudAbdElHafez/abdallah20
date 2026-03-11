import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import issueVoucherReturnsApi from '../../api/issueVoucherReturnsApi';

// Async thunks
export const fetchIssueVoucherReturns = createAsyncThunk(
    'issueVoucherReturns/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.getAll(filters);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue voucher returns');
        }
    }
);

export const fetchIssueVoucherReturnById = createAsyncThunk(
    'issueVoucherReturns/fetchById',
    async ({ id, ...params }, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.getById(id, params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue voucher return');
        }
    }
);

export const createIssueVoucherReturn = createAsyncThunk(
    'issueVoucherReturns/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.create(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create issue voucher return');
        }
    }
);

export const updateIssueVoucherReturn = createAsyncThunk(
    'issueVoucherReturns/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.update(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update issue voucher return');
        }
    }
);

export const deleteIssueVoucherReturn = createAsyncThunk(
    'issueVoucherReturns/delete',
    async (id, { rejectWithValue }) => {
        try {
            await issueVoucherReturnsApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete issue voucher return');
        }
    }
);

export const updateReturnStatus = createAsyncThunk(
    'issueVoucherReturns/updateStatus',
    async ({ id, status, approved_by }, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.updateStatus(id, { status, approved_by });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update return status');
        }
    }
);

export const fetchVoucherItems = createAsyncThunk(
    'issueVoucherReturns/fetchVoucherItems',
    async (voucherId, { rejectWithValue }) => {
        try {
            const response = await issueVoucherReturnsApi.getVoucherItems(voucherId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch voucher items');
        }
    }
);

const initialState = {
    returns: [],
    currentReturn: null,
    voucherItems: [],
    loading: false,
    error: null,
    success: false,
    filters: {
        status: '',
        warehouse_id: '',
        issue_voucher_id: '',
        start_date: '',
        end_date: ''
    }
};

const issueVoucherReturnsSlice = createSlice({
    name: 'issueVoucherReturns',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearCurrentReturn: (state) => {
            state.currentReturn = null;
        },
        clearVoucherItems: (state) => {
            state.voucherItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all returns
            .addCase(fetchIssueVoucherReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssueVoucherReturns.fulfilled, (state, action) => {
                state.loading = false;
                state.returns = action.payload.data;
                state.success = true;
            })
            .addCase(fetchIssueVoucherReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch return by ID
            .addCase(fetchIssueVoucherReturnById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIssueVoucherReturnById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReturn = action.payload.data;
            })
            .addCase(fetchIssueVoucherReturnById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create return
            .addCase(createIssueVoucherReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createIssueVoucherReturn.fulfilled, (state, action) => {
                state.loading = false;
                state.returns.unshift(action.payload.data);
                state.success = true;
            })
            .addCase(createIssueVoucherReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update return
            .addCase(updateIssueVoucherReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIssueVoucherReturn.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload.data;
                const index = state.returns.findIndex(r => r.id === updated.id);
                if (index !== -1) {
                    state.returns[index] = updated;
                }
                if (state.currentReturn && state.currentReturn.id === updated.id) {
                    state.currentReturn = updated;
                }
                state.success = true;
            })
            .addCase(updateIssueVoucherReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete return
            .addCase(deleteIssueVoucherReturn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteIssueVoucherReturn.fulfilled, (state, action) => {
                state.loading = false;
                state.returns = state.returns.filter(r => r.id !== action.payload);
                state.success = true;
            })
            .addCase(deleteIssueVoucherReturn.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update status
            .addCase(updateReturnStatus.fulfilled, (state, action) => {
                const updated = action.payload.data;
                const index = state.returns.findIndex(r => r.id === updated.id);
                if (index !== -1) {
                    state.returns[index] = updated;
                }
                if (state.currentReturn && state.currentReturn.id === updated.id) {
                    state.currentReturn = updated;
                }
                state.success = true;
            })
            // Fetch voucher items
            .addCase(fetchVoucherItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVoucherItems.fulfilled, (state, action) => {
                state.loading = false;
                state.voucherItems = action.payload.data;
            })
            .addCase(fetchVoucherItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    clearSuccess,
    setFilters,
    clearFilters,
    clearCurrentReturn,
    clearVoucherItems
} = issueVoucherReturnsSlice.actions;

export default issueVoucherReturnsSlice.reducer;
