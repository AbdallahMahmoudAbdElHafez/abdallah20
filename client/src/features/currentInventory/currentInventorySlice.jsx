import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import currentInventoryApi from "../../api/currentInventoryApi.jsx";

export const fetchInventory = createAsyncThunk(
  "currentInventory/fetchAll",
  async () => {
    const res = await currentInventoryApi.getAll();
    return res.data;
  }
);

export const addInventory = createAsyncThunk(
  "currentInventory/add",
  async (data) => {
    const res = await currentInventoryApi.create(data);
    return res.data;
  }
);

export const updateInventory = createAsyncThunk(
  "currentInventory/update",
  async ({ id, data }) => {
    const res = await currentInventoryApi.update(id, data);
    return res.data;
  }
);

export const deleteInventory = createAsyncThunk(
  "currentInventory/delete",
  async (id) => {
    await currentInventoryApi.remove(id);
    return id;
  }
);

const slice = createSlice({
  name: "currentInventory",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchInventory.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      .addCase(addInventory.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateInventory.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(deleteInventory.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
      });
  },
});

export default slice.reducer;
