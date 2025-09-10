import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import warehousesApi from "../../api/warehousesApi";


export const fetchWarehouses = createAsyncThunk("warehouses/fetchWarehouses", async () => {
  const res = await warehousesApi.getAll();
  return res.data;
});

export const addWarehouse = createAsyncThunk("warehouses/addWarehouse", async (data) => {
  const res = await warehousesApi.create(data);
  return res.data;
});

export const updateWarehouse = createAsyncThunk(
  "warehouses/updateWarehouse",
  async ({ id, data }) => {
    const res = await warehousesApi.update(id, data);
    return res.data;
  }
);

export const deleteWarehouse = createAsyncThunk("warehouses/deleteWarehouse", async (id) => {
  await warehousesApi.delete(id);
  return id;
});

const warehousesSlice = createSlice({
  name: "warehouses",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => { state.loading = true; })
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addWarehouse.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export default warehousesSlice.reducer;
