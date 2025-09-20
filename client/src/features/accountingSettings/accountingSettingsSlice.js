import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/accountingSettingsApi";

export const fetchSettings = createAsyncThunk(
  "accountingSettings/fetch",
  async () => (await api.list()).data
);

export const createSetting = createAsyncThunk(
  "accountingSettings/create",
  async (data) => (await api.create(data)).data
);

export const updateSetting = createAsyncThunk(
  "accountingSettings/update",
  async ({ id, data }) => (await api.update(id, data)).data
);

export const deleteSetting = createAsyncThunk(
  "accountingSettings/delete",
  async (id) => {
    await api.remove(id);
    return id;
  }
);

const slice = createSlice({
  name: "accountingSettings",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (s) => { s.status = "loading"; })
      .addCase(fetchSettings.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.list = a.payload;
      })
      .addCase(fetchSettings.rejected, (s, a) => {
        s.status = "failed"; s.error = a.error.message;
      })
      .addCase(createSetting.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updateSetting.fulfilled, (s, a) => {
        const idx = s.list.findIndex(x => x.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(deleteSetting.fulfilled, (s, a) => {
        s.list = s.list.filter(x => x.id !== a.payload);
      });
  },
});

export default slice.reducer;
