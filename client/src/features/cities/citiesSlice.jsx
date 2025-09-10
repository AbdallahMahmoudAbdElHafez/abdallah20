import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import citiesApi from "../../api/citiesApi";

export const fetchCities = createAsyncThunk("cities/fetchCities", async () => {
  const res = await citiesApi.getAll();
  return res.data;
});

export const addCity = createAsyncThunk("cities/addCity", async (data) => {
  const res = await citiesApi.create(data);
  return res.data;
});

export const updateCity = createAsyncThunk(
  "cities/updateCity",
  async ({ id, data }) => {
    const res = await citiesApi.update(id, data);
    return res.data;
  }
);

export const deleteCity = createAsyncThunk("cities/deleteCity", async (id) => {
  await citiesApi.delete(id);
  return id;
});

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => { state.loading = true; })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCity.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateCity.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

export default citiesSlice.reducer;
