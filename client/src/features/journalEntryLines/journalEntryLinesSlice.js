import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import journalEntryLinesApi from "../../api/journalEntryLinesApi";

export const fetchJournalEntryLines = createAsyncThunk(
  "journalEntryLines/fetchAll",
  async () => {
    const res = await journalEntryLinesApi.getAll();
    return res.data;
  }
);

export const addJournalEntryLine = createAsyncThunk(
  "journalEntryLines/add",
  async (data) => {
    const res = await journalEntryLinesApi.create(data);
    return res.data;
  }
);

export const updateJournalEntryLine = createAsyncThunk(
  "journalEntryLines/update",
  async ({ id, data }) => {
    const res = await journalEntryLinesApi.update(id, data);
    return res.data;
  }
);

export const deleteJournalEntryLine = createAsyncThunk(
  "journalEntryLines/delete",
  async (id) => {
    await journalEntryLinesApi.delete(id);
    return id;
  }
);

const journalEntryLinesSlice = createSlice({
  name: "journalEntryLines",
  initialState: {
    lines: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournalEntryLines.pending, (state) => { state.loading = true; })
      .addCase(fetchJournalEntryLines.fulfilled, (state, action) => {
        state.loading = false;
        state.lines = action.payload;
      })
      .addCase(fetchJournalEntryLines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addJournalEntryLine.fulfilled, (state, action) => {
        state.lines.push(action.payload);
      })
      .addCase(updateJournalEntryLine.fulfilled, (state, action) => {
        const index = state.items?.findIndex((l) => l.id === action.payload.id) ??
          state.lines.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          if (state.items) state.items[index] = action.payload;
          else state.lines[index] = action.payload;
        }
      })
      .addCase(deleteJournalEntryLine.fulfilled, (state, action) => {
        state.lines = state.lines.filter((l) => l.id !== action.payload);
        if (state.items) state.items = state.items.filter((l) => l.id !== action.payload);
      });
  }
});

export default journalEntryLinesSlice.reducer;
