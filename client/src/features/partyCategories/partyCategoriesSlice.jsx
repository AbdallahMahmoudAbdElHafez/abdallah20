import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import partyCategoriesApi from "../../api/partyCategoriesApi";

// Async thunks
export const fetchPartyCategories = createAsyncThunk(
  "partyCategories/fetchAll",
  async () => {
    const response = await partyCategoriesApi.getAll();
    return response.data;
  }
);

export const addPartyCategory = createAsyncThunk(
  "partyCategories/add",
  async (category) => {
    const response = await partyCategoriesApi.create(category);
    return response.data;
  }
);

export const updatePartyCategory = createAsyncThunk(
  "partyCategories/update",
  async ({ id, data }) => {
    const response = await partyCategoriesApi.update(id, data);
    return response.data;
  }
);

export const deletePartyCategory = createAsyncThunk(
  "partyCategories/delete",
  async (id) => {
    await partyCategoriesApi.delete(id);
    return id;
  }
);

// Slice
const partyCategoriesSlice = createSlice({
  name: "partyCategories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPartyCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPartyCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPartyCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // add
      .addCase(addPartyCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(updatePartyCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // delete
      .addCase(deletePartyCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default partyCategoriesSlice.reducer;
