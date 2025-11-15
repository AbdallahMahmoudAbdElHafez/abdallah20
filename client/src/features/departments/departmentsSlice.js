import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DepartmentsApi from "../../api/departmentsApi";

// ===== Thunks =====
export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async () => {
    const res = await DepartmentsApi.getAll();
    return res.data;
  }
);

export const addDepartment = createAsyncThunk(
  "departments/add",
  async (data) => {
    const res = await DepartmentsApi.create(data);
    return res.data;
  }
);

export const updateDepartment = createAsyncThunk(
  "departments/update",
  async ({ id, data }) => {
    const res = await DepartmentsApi.update(id, data);
    return res.data;
  }
);

export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  async (id) => {
    await DepartmentsApi.remove(id);
    return id;
  }
);

// ===== Slice =====
const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      // Create
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.list.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d.id !== action.payload);
      });
  },
});

export default departmentsSlice.reducer;
