// src/store/issueVoucherTypeAccountsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/issueVoucherTypeAccountsApi";

export const fetchAccountsByType = createAsyncThunk(
  "issueVoucherTypeAccounts/fetchByType",
  async (typeId) => {
    const res = await api.getByType(typeId);
    return { typeId, data: res.data };
  }
);

export const addAccountToType = createAsyncThunk(
  "issueVoucherTypeAccounts/add",
  async ({ issue_voucher_type_id, account_id }) => {
    const res = await api.create({ issue_voucher_type_id, account_id });
    return res.data;
  }
);

export const bulkAddAccountsToType = createAsyncThunk(
  "issueVoucherTypeAccounts/bulkAdd",
  async (list) => {
    const res = await api.bulkCreate(list);
    return res.data;
  }
);

export const removeAccountFromType = createAsyncThunk(
  "issueVoucherTypeAccounts/remove",
  async (id) => {
    await api.remove(id);
    return id;
  }
);

const slice = createSlice({
  name: "issueVoucherTypeAccounts",
  initialState: {
    // stores by typeId for quick access
    byType: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearType(state, action) {
      delete state.byType[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsByType.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAccountsByType.fulfilled, (s, action) => {
        s.loading = false;
        s.byType[action.payload.typeId] = action.payload.data;
      })
      .addCase(fetchAccountsByType.rejected, (s, action) => {
        s.loading = false;
        s.error = action.error.message;
      })
      .addCase(addAccountToType.fulfilled, (s, action) => {
        const rec = action.payload;
        const typeId = rec.issue_voucher_type_id;
        s.byType[typeId] = s.byType[typeId] ? [...s.byType[typeId], rec] : [rec];
      })
      .addCase(removeAccountFromType.fulfilled, (s, action) => {
        const deletedId = action.payload;
        for (const t of Object.keys(s.byType)) {
          s.byType[t] = s.byType[t].filter((r) => r.id !== deletedId);
        }
      })
      .addCase(bulkAddAccountsToType.fulfilled, (s, action) => {
        const rows = action.payload; // array of created rows
        if (Array.isArray(rows) && rows.length) {
          const typeId = rows[0].issue_voucher_type_id;
          s.byType[typeId] = s.byType[typeId] ? [...s.byType[typeId], ...rows] : rows;
        }
      });
  },
});

export const { clearType } = slice.actions;
export default slice.reducer;
