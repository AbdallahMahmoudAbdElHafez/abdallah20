import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeesApi from "../../api/employeesApi";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async () => {
    const res = await employeesApi.getAll();
    return res.data;
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (data) => {
    const res = await employeesApi.create(data);
    return res.data;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, data }) => {
    const res = await employeesApi.update(id, data);
    return res.data;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id) => {
    await employeesApi.delete(id);
    return id;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex((e) => e.id === action.payload.id);
        state.list[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter((e) => e.id !== action.payload);
      });
  },
});

export default employeesSlice.reducer;
