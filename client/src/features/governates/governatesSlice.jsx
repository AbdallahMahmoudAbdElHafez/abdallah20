import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import governatesApi from "../../api/governatesApi";

export const fetchGovernates = createAsyncThunk("governates/fetchGovernates", async () => {
  const res = await governatesApi.getAll();
  return res.data;
});

export const addGovernate = createAsyncThunk("governates/addGovernate", async (data) => {
  const res = await governatesApi.create(data);
  return res.data;
});

export const updateGovernate = createAsyncThunk(
  "governates/updateGovernate",
  async ({ id, data }) => {
    const res = await governatesApi.update(id, data);
    return res.data;
  }
);

export const deleteGovernate = createAsyncThunk("governates/deleteGovernate", async (id) => {
  await governatesApi.delete(id);
  return id;
});

const governatesSlice = createSlice({
  name: "governates",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGovernates.pending, (state) => { state.loading = true; })
      .addCase(fetchGovernates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGovernates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addGovernate.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateGovernate.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteGovernate.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export default governatesSlice.reducer;
