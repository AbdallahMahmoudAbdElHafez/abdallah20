import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import unitsApi from "../../api/unitsApi";

// Actions
export const fetchUnits = createAsyncThunk("units/fetchUnits", async () => {
  const res = await unitsApi.getAll();
  return res.data;
});

export const addUnit = createAsyncThunk("units/addUnit", async (unit) => {
  const res = await unitsApi.create(unit);
  return res.data;
});

export const deleteUnit = createAsyncThunk("units/deleteUnit", async (id) => {
  await unitsApi.delete(id);
  return id;
});
export const updateUnit = createAsyncThunk("units/updateUnit", async ({ id, data }) => {
  const res = await unitsApi.update(id, data);
  return res.data;
});

// Slice
const unitsSlice = createSlice({
  name: "units",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addUnit.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Delete
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.items = state.items.filter((u) => u.id !== action.payload);
      })
      // Update
      .addCase(updateUnit.fulfilled, (state, action) => {
        const index = state.items.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  },

});

export default unitsSlice.reducer;
