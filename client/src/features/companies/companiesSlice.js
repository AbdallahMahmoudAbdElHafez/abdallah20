import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchCompanies = createAsyncThunk(
    "companies/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/companies");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch companies");
        }
    }
);

export const addCompany = createAsyncThunk(
    "companies/add",
    async (company, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axiosClient.post("/companies", company, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add company");
        }
    }
);

export const updateCompany = createAsyncThunk(
    "companies/update",
    async ({ id, data }, { rejectWithValue }) => { // Changed signature to accept {id, data} where data is FormData
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axiosClient.put(`/companies/${id}`, data, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update company");
        }
    }
);

export const deleteCompany = createAsyncThunk(
    "companies/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/companies/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete company");
        }
    }
);

const companiesSlice = createSlice({
    name: "companies",
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addCompany.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateCompany.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default companiesSlice.reducer;
