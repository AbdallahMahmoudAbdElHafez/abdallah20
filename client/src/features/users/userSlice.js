import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/users`);
  return res.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: { data: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});

export default userSlice.reducer;
