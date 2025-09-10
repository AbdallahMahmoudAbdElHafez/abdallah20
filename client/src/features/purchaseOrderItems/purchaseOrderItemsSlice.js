import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseOrderItemsApi from "../../api/purchaseOrderItemsApi";

export const fetchItemsByOrder = createAsyncThunk(
  "purchaseOrderItems/fetchByOrder",
  async (orderId) => {
    const res = await purchaseOrderItemsApi.getAllByOrder(orderId);
    console.log(res)
   
    return res.data;
  }
);

export const createItem = createAsyncThunk(
  "purchaseOrderItems/create",
  async (item) => {
    const res = await purchaseOrderItemsApi.create(item);
    return res.data;
  }
);

export const updateItem = createAsyncThunk(
  "purchaseOrderItems/update",
  async ({ id, data }) => {
    const res = await purchaseOrderItemsApi.update(id, data);
    return res.data;
  }
);

export const deleteItem = createAsyncThunk(
  "purchaseOrderItems/delete",
  async (id) => {
    await purchaseOrderItemsApi.delete(id);
    return id;
  }
);

const purchaseOrderItemsSlice = createSlice({
  name: "purchaseOrderItems",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsByOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItemsByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearItems } = purchaseOrderItemsSlice.actions;
export default purchaseOrderItemsSlice.reducer;
