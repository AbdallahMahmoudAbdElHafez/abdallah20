import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import countriesApi from "../../api/countriesApi";

export const fetchCountries = createAsyncThunk("countries/fetchCountries", async () => {
  const res = await countriesApi.getAll();
  return res.data;
});

export const addCountry = createAsyncThunk("countries/addCountry", async (data) => {
  const res = await countriesApi.create(data);
  return res.data;
});

export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, data }) => {
    const res = await countriesApi.update(id, data);
    return res.data;
  }
);

export const deleteCountry = createAsyncThunk("countries/deleteCountry", async (id) => {
  await countriesApi.delete(id);
  return id;
});

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => { state.loading = true; })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCountry.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default countriesSlice.reducer;
