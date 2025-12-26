import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import doctorsApi from "../../api/doctorsApi";

export const fetchDoctors = createAsyncThunk("doctors/fetchAll", async () => {
    const res = await doctorsApi.getAll();
    return res.data;
});

export const addDoctor = createAsyncThunk("doctors/add", async (data) => {
    const res = await doctorsApi.create(data);
    return res.data;
});

export const updateDoctor = createAsyncThunk(
    "doctors/update",
    async ({ id, data }) => {
        const res = await doctorsApi.update(id, data);
        return res.data;
    }
);

export const deleteDoctor = createAsyncThunk("doctors/delete", async (id) => {
    await doctorsApi.delete(id);
    return id;
});

const doctorsSlice = createSlice({
    name: "doctors",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDoctors.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchDoctors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addDoctor.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateDoctor.fulfilled, (state, action) => {
                const index = state.list.findIndex((d) => d.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteDoctor.fulfilled, (state, action) => {
                state.list = state.list.filter((d) => d.id !== action.payload);
            });
    },
});

export default doctorsSlice.reducer;
