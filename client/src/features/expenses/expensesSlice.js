import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import expensesApi from "../../api/expensesApi";

export const fetchExpenses = createAsyncThunk("expenses/fetchExpenses", async () => {
    const res = await expensesApi.getAll();
    return res.data;
});

export const addExpense = createAsyncThunk("expenses/addExpense", async (expense) => {
    const res = await expensesApi.create(expense);
    return res.data;
});

export const updateExpense = createAsyncThunk("expenses/updateExpense", async ({ id, data }) => {
    const res = await expensesApi.update(id, data);
    return res.data;
});

export const deleteExpense = createAsyncThunk("expenses/deleteExpense", async (id) => {
    await expensesApi.delete(id);
    return id;
});

const expensesSlice = createSlice({
    name: "expenses",
    initialState: { items: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => { state.loading = true; })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addExpense.fulfilled, (state, action) => { state.items.push(action.payload); })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default expensesSlice.reducer;
