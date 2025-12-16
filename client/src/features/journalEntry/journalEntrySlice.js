import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchJournalEntries = createAsyncThunk(
    "journalEntries/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/journal-entries");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch journal entries");
        }
    }
);

export const addJournalEntry = createAsyncThunk(
    "journalEntries/add",
    async (entry, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/journal-entries", entry);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add journal entry");
        }
    }
);

export const updateJournalEntry = createAsyncThunk(
    "journalEntries/update",
    async ({ id, ...data }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/journal-entries/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update journal entry");
        }
    }
);

export const deleteJournalEntry = createAsyncThunk(
    "journalEntries/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/journal-entries/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete journal entry");
        }
    }
);

const journalEntrySlice = createSlice({
    name: "journalEntries",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchJournalEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJournalEntries.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchJournalEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addJournalEntry.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateJournalEntry.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteJournalEntry.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default journalEntrySlice.reducer;
