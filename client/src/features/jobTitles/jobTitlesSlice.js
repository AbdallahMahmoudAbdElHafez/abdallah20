import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobTitlesApi from "../../api/jobTitlesApi";

export const fetchJobTitles = createAsyncThunk(
  "jobTitles/fetchAll",
  async () => {
    const res = await jobTitlesApi.getAll();
    return res.data;
  }
);

export const createJobTitle = createAsyncThunk(
  "jobTitles/create",
  async (data) => {
    const res = await jobTitlesApi.create(data);
    return res.data;
  }
);

export const updateJobTitle = createAsyncThunk(
  "jobTitles/update",
  async ({ id, data }) => {
    const res = await jobTitlesApi.update(id, data);
    return res.data;
  }
);

export const deleteJobTitle = createAsyncThunk(
  "jobTitles/delete",
  async (id) => {
    await jobTitlesApi.delete(id);
    return id;
  }
);

const jobTitlesSlice = createSlice({
  name: "jobTitles",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createJobTitle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateJobTitle.fulfilled, (state, action) => {
        const i = state.items.findIndex((x) => x.id === action.payload.id);
        if (i !== -1) state.items[i] = action.payload;
      })
      .addCase(deleteJobTitle.fulfilled, (state, action) => {
        state.items = state.items.filter((x) => x.id !== action.payload);
      });
  },
});

export default jobTitlesSlice.reducer;
