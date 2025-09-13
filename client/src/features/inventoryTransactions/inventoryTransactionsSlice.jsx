import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchInventoryTransactionsApi,
  addInventoryTransactionApi,
  updateInventoryTransactionApi,
  deleteInventoryTransactionApi,
} from "../../api/inventoryTransactionsApi";

export const fetchInventoryTransactions = createAsyncThunk(
  "inventoryTransactions/fetchAll",
  async () => {
    const { data } = await fetchInventoryTransactionsApi();
    return data;
  }
);

export const addInventoryTransaction = createAsyncThunk(
  "inventoryTransactions/add",
  async (payload) => {
    const { data } = await addInventoryTransactionApi(payload);
    return data;
  }
);

export const updateInventoryTransaction = createAsyncThunk(
  "inventoryTransactions/update",
  async ({ id, data: payload }) => {
    const { data } = await updateInventoryTransactionApi(id, payload);
    return data;
  }
);

export const deleteInventoryTransaction = createAsyncThunk(
  "inventoryTransactions/delete",
  async (id) => {
    await deleteInventoryTransactionApi(id);
    return id;
  }
);

const slice = createSlice({
  name: "inventoryTransactions",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventoryTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInventoryTransaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateInventoryTransaction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx > -1) state.items[idx] = action.payload;
      })
      .addCase(deleteInventoryTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default slice.reducer;
