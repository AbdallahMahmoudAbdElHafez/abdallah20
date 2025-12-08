import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import entryTypesApi from "../../api/entryTypesApi";

export const fetchEntryTypes = createAsyncThunk("entryTypes/fetchEntryTypes", async () => {
    const res = await entryTypesApi.getAll();
    return res.data;
});

export const addEntryType = createAsyncThunk("entryTypes/addEntryType", async (data) => {
    const res = await entryTypesApi.create(data);
    return res.data;
});

export const updateEntryType = createAsyncThunk(
    "entryTypes/updateEntryType",
    async ({ id, data }) => {
        const res = await entryTypesApi.update(id, data);
        return res.data;
    }
);

export const deleteEntryType = createAsyncThunk("entryTypes/deleteEntryType", async (id) => {
    await entryTypesApi.delete(id);
    return id;
});

const entryTypesSlice = createSlice({
    name: "entryTypes",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEntryTypes.pending, (state) => { state.loading = true; })
            .addCase(fetchEntryTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchEntryTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addEntryType.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateEntryType.fulfilled, (state, action) => {
                const index = state.items.findIndex((et) => et.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteEntryType.fulfilled, (state, action) => {
                state.items = state.items.filter((et) => et.id !== action.payload);
            });
    },
});

export default entryTypesSlice.reducer;
