import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import issueVouchersApi from '../../api/issueVouchersApi';

// Async thunks
export const fetchIssueVouchers = createAsyncThunk(
  'issueVouchers/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await issueVouchersApi.getAll(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue vouchers');
    }
  }
);

export const fetchIssueVoucherById = createAsyncThunk(
  'issueVouchers/fetchById',
  async ({ id, ...params }, { rejectWithValue }) => {
    try {
      const response = await issueVouchersApi.getById(id, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issue voucher');
    }
  }
);

export const createIssueVoucher = createAsyncThunk(
  'issueVouchers/create',
  async (voucherData, { rejectWithValue }) => {
    try {
      const response = await issueVouchersApi.create(voucherData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create issue voucher');
    }
  }
);

export const updateIssueVoucher = createAsyncThunk(
  'issueVouchers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await issueVouchersApi.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update issue voucher');
    }
  }
);

export const deleteIssueVoucher = createAsyncThunk(
  'issueVouchers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await issueVouchersApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete issue voucher');
    }
  }
);

export const updateVoucherStatus = createAsyncThunk(
  'issueVouchers/updateStatus',
  async ({ id, status, approved_by }, { rejectWithValue }) => {
    try {
      const response = await issueVouchersApi.updateStatus(id, { status, approved_by });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update voucher status');
    }
  }
);

const initialState = {
  vouchers: [],
  currentVoucher: null,
  loading: false,
  error: null,
  success: false,
  filters: {
    status: '',
    warehouse_id: '',
    start_date: '',
    end_date: ''
  }
};

const issueVouchersSlice = createSlice({
  name: 'issueVouchers',
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
      state.filters = {
        status: '',
        warehouse_id: '',
        start_date: '',
        end_date: ''
      };
    },
    clearCurrentVoucher: (state) => {
      state.currentVoucher = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all vouchers
      .addCase(fetchIssueVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload.data;
        state.success = true;
      })
      .addCase(fetchIssueVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch voucher by ID
      .addCase(fetchIssueVoucherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueVoucherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVoucher = action.payload.data;
      })
      .addCase(fetchIssueVoucherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create voucher
      .addCase(createIssueVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssueVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers.unshift(action.payload.data);
        state.success = true;
      })
      .addCase(createIssueVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update voucher
      .addCase(updateIssueVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssueVoucher.fulfilled, (state, action) => {
        state.loading = false;
        const updatedVoucher = action.payload.data;
        const index = state.vouchers.findIndex(v => v.id === updatedVoucher.id);
        if (index !== -1) {
          state.vouchers[index] = updatedVoucher;
        }
        if (state.currentVoucher && state.currentVoucher.id === updatedVoucher.id) {
          state.currentVoucher = updatedVoucher;
        }
        state.success = true;
      })
      .addCase(updateIssueVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete voucher
      .addCase(deleteIssueVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssueVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = state.vouchers.filter(v => v.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteIssueVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update status
      .addCase(updateVoucherStatus.fulfilled, (state, action) => {
        const updatedVoucher = action.payload.data;
        const index = state.vouchers.findIndex(v => v.id === updatedVoucher.id);
        if (index !== -1) {
          state.vouchers[index] = updatedVoucher;
        }
        if (state.currentVoucher && state.currentVoucher.id === updatedVoucher.id) {
          state.currentVoucher = updatedVoucher;
        }
        state.success = true;
      });
  }
});

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  clearCurrentVoucher
} = issueVouchersSlice.actions;

export default issueVouchersSlice.reducer;