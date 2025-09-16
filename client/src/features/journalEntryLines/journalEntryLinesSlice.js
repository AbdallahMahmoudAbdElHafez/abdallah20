import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchJournalEntryLines = createAsyncThunk(
  "journalEntryLines/fetch",
  async () => {
    const res = await axios.get("api/journal-entry-lines"); 
    return res.data;
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
      });
  }
});

export default journalEntryLinesSlice.reducer;
