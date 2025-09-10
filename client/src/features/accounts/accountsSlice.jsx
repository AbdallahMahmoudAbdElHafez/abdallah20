import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import accountsApi from "../../api/accountsApi";

// Async Thunks
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
  const res = await accountsApi.getAll();
  return res.data;
  }
);

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (data) => {
    console.log(data);
  const res = await accountsApi.create(data);
  return res.data;
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async ({ id, data }) => {
    const res = await accountsApi.update(id, data);
    return res.data;
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id, { rejectWithValue }) => {
    try {
      await accountsApi.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Slice
const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addAccount.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (acc) => acc.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      // Delete
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.items = state.items.filter((acc) => acc.id !== action.payload);
      });
  },
});

export default accountsSlice.reducer;
