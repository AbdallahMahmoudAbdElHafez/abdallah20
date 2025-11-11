import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import externalJobOrdersApi from "../../api/externalJobOrdersApi.jsx";

export const fetchJobOrders = createAsyncThunk(
  "externalJobOrders/fetchAll",
  async () => {
    const res = await externalJobOrdersApi.getAll();
    return res.data;
  }
);

export const addJobOrder = createAsyncThunk(
  "externalJobOrders/add",
  async (data) => {
    const res = await externalJobOrdersApi.create(data);
    return res.data;
  }
);

export const updateJobOrder = createAsyncThunk(
  "externalJobOrders/update",
  async ({ id, data }) => {
    const res = await externalJobOrdersApi.update(id, data);
    return res.data;
  }
);

export const deleteJobOrder = createAsyncThunk(
  "externalJobOrders/delete",
  async (id) => {
    await externalJobOrdersApi.remove(id);
    return id;
  }
);

const slice = createSlice({
  name: "externalJobOrders",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJobOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addJobOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateJobOrder.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteJobOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default slice.reducer;
