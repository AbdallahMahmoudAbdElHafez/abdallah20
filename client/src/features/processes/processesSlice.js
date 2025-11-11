import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import processesApi from "../../api/processesApi";

export const fetchProcesses = createAsyncThunk("processes/fetchAll", async () => {
  return await processesApi.getAll();
});

export const addProcess = createAsyncThunk("processes/add", async (data) => {
  return await processesApi.create(data);
});

export const updateProcess = createAsyncThunk("processes/update", async ({ id, data }) => {
  return await processesApi.update(id, data);
});

export const deleteProcess = createAsyncThunk("processes/delete", async (id) => {
  await processesApi.remove(id);
  return id;
});

const processesSlice = createSlice({
  name: "processes",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcesses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProcesses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProcesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProcess.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProcess.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProcess.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default processesSlice.reducer;
