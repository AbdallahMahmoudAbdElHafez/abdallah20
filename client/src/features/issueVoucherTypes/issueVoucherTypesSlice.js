// src/store/issueVoucherTypesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import issueVoucherTypesApi from "../api/issueVoucherTypesApi";

export const fetchIssueVoucherTypes = createAsyncThunk(
  "issueVoucherTypes/fetchAll",
  async () => {
    const res = await issueVoucherTypesApi.getAll();
    return res.data;
  }
);

export const createIssueVoucherType = createAsyncThunk(
  "issueVoucherTypes/create",
  async (data) => {
    const res = await issueVoucherTypesApi.create(data);
    return res.data;
  }
);

export const updateIssueVoucherType = createAsyncThunk(
  "issueVoucherTypes/update",
  async ({ id, data }) => {
    const res = await issueVoucherTypesApi.update(id, data);
    return res.data;
  }
);

export const deleteIssueVoucherType = createAsyncThunk(
  "issueVoucherTypes/delete",
  async (id) => {
    await issueVoucherTypesApi.delete(id);
    return id;
  }
);

const issueVoucherTypesSlice = createSlice({
  name: "issueVoucherTypes",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchIssueVoucherTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIssueVoucherTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      // Create
      .addCase(createIssueVoucherType.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateIssueVoucherType.fulfilled, (state, action) => {
        const idx = state.list.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })

      // Delete
      .addCase(deleteIssueVoucherType.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload);
      });
  },
});

export default issueVoucherTypesSlice.reducer;
