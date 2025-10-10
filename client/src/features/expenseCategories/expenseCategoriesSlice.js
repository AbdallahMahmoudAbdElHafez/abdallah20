// src/store/slices/expenseCategoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expenseCategoryApi from "../../api/expenseCategoryApi";

// Thunks
export const fetchExpenseCategories = createAsyncThunk(
  "expenseCategories/getAll",
  async () => {
    const res = await expenseCategoryApi.getAll();
    return res.data;
  }
);

export const addExpenseCategory = createAsyncThunk(
  "expenseCategories/add",
  async (category) => {
    const res = await expenseCategoryApi.create(category);
    return res.data;
  }
);

export const editExpenseCategory = createAsyncThunk(
  "expenseCategories/edit",
  async ({ id, category }) => {
    const res = await expenseCategoryApi.update(id, category);
    return res.data;
  }
);

export const removeExpenseCategory = createAsyncThunk(
  "expenseCategories/delete",
  async (id) => {
    await expenseCategoryApi.delete(id);
    return id;
  }
);

const expenseCategoriesSlice = createSlice({
  name: "expenseCategories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addExpenseCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(editExpenseCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(removeExpenseCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default expenseCategoriesSlice.reducer;
