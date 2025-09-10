import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import partiesApi from "../../api/partiesApi";

export const fetchParties = createAsyncThunk("parties/getAll", async () => {

  const res = await partiesApi.getAll();
  return res.data

});

export const addParty = createAsyncThunk("parties/add", async (party) => {
  const res = await partiesApi.create(party);
    return res.data
});

export const editParty = createAsyncThunk("parties/edit", async ({ id, party }) => {
  const res = await partiesApi.update(id, party);
    return res.data
});

export const removeParty = createAsyncThunk("parties/delete", async (id) => {
  await partiesApi.delete(id);
  return id;
});

const partiesSlice = createSlice({
  name: "parties",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParties.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addParty.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Edit
      .addCase(editParty.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete
      .addCase(removeParty.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default partiesSlice.reducer;
