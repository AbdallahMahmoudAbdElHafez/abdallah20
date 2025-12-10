import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Autocomplete,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography,
    Alert,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchEntryTypes } from "../features/entryTypes/entryTypesSlice";
import axiosClient from "../api/axiosClient";

export default function ManualJournalEntryDialog({ open, onClose, onSuccess }) {
    const dispatch = useDispatch();
    const { items: accounts } = useSelector((state) => state.accounts);
    const { items: entryTypes } = useSelector((state) => state.entryTypes);

    const [entryData, setEntryData] = useState({
        entryDate: new Date().toISOString().split("T")[0],
        description: "",
        entryTypeId: 1,
    });

    const [lines, setLines] = useState([
        { account_id: "", debit: 0, credit: 0, description: "" },
        { account_id: "", debit: 0, credit: 0, description: "" },
    ]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(fetchAccounts());
            dispatch(fetchEntryTypes());
        }
    }, [open, dispatch]);

    const addLine = () => {
        setLines([...lines, { account_id: "", debit: 0, credit: 0, description: "" }]);
    };

    const removeLine = (index) => {
        if (lines.length > 2) {
            setLines(lines.filter((_, i) => i !== index));
        }
    };

    const updateLine = (index, field, value) => {
        const newLines = [...lines];
        newLines[index][field] = value;

        // If debit is entered, clear credit and vice versa
        if (field === "debit" && value > 0) {
            newLines[index].credit = 0;
        } else if (field === "credit" && value > 0) {
            newLines[index].debit = 0;
        }

        setLines(newLines);
    };

    const calculateTotals = () => {
        const totalDebit = lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0);
        const totalCredit = lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0);
        return { totalDebit, totalCredit };
    };

    const validateEntry = () => {
        // Check all lines have accounts
        if (lines.some(line => !line.account_id)) {
            setError("يجب اختيار حساب لجميع السطور");
            return false;
        }

        // Check all lines have either debit or credit
        if (lines.some(line => Number(line.debit) === 0 && Number(line.credit) === 0)) {
            setError("يجب أن يحتوي كل سطر على مبلغ مدين أو دائن");
            return false;
        }

        // Check balance
        const { totalDebit, totalCredit } = calculateTotals();
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            setError(`القيد غير متوازن: المدين ${totalDebit.toFixed(2)} ≠ الدائن ${totalCredit.toFixed(2)}`);
            return false;
        }

        if (totalDebit === 0 || totalCredit === 0) {
            setError("يجب أن يحتوي القيد على مبالغ مدينة ودائنة");
            return false;
        }

        setError("");
        return true;
    };

    const handleSave = async () => {
        if (!validateEntry()) return;

        setLoading(true);
        try {
            const payload = {
                entryDate: entryData.entryDate,
                description: entryData.description,
                entryTypeId: entryData.entryTypeId,
                lines: lines.map(line => ({
                    account_id: line.account_id,
                    debit: Number(line.debit) || 0,
                    credit: Number(line.credit) || 0,
                    description: line.description || "",
                })),
            };

            await axiosClient.post("/journal-entries/manual", payload);

            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || "فشل في إنشاء القيد");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEntryData({
            entryDate: new Date().toISOString().split("T")[0],
            description: "",
            entryTypeId: 1,
        });
        setLines([
            { account_id: "", debit: 0, credit: 0, description: "" },
            { account_id: "", debit: 0, credit: 0, description: "" },
        ]);
        setError("");
        onClose();
    };

    const { totalDebit, totalCredit } = calculateTotals();
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ direction: "rtl" }}>إنشاء قيد يدوي</DialogTitle>
            <DialogContent>
                <Box sx={{ direction: "rtl", mt: 2 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Entry Header */}
                    <Box display="flex" gap={2} mb={3}>
                        <TextField
                            label="التاريخ"
                            type="date"
                            value={entryData.entryDate}
                            onChange={(e) => setEntryData({ ...entryData, entryDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>نوع القيد</InputLabel>
                            <Select
                                value={entryData.entryTypeId}
                                label="نوع القيد"
                                onChange={(e) => setEntryData({ ...entryData, entryTypeId: e.target.value })}
                            >
                                {entryTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="الوصف"
                            value={entryData.description}
                            onChange={(e) => setEntryData({ ...entryData, description: e.target.value })}
                            fullWidth
                            multiline
                        />
                    </Box>

                    {/* Lines Table */}
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        سطور القيد
                    </Typography>

                    <Table size="small" sx={{ mb: 2 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: "right" }}>الحساب</TableCell>
                                <TableCell sx={{ textAlign: "right", width: 120 }}>مدين</TableCell>
                                <TableCell sx={{ textAlign: "right", width: 120 }}>دائن</TableCell>
                                <TableCell sx={{ textAlign: "right" }}>البيان</TableCell>
                                <TableCell sx={{ width: 60 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lines.map((line, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Autocomplete
                                            options={accounts}
                                            getOptionLabel={(option) => option.name}
                                            value={accounts.find((a) => a.id === line.account_id) || null}
                                            onChange={(_, newValue) => updateLine(index, "account_id", newValue?.id || "")}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder="اختر حساب" size="small" />
                                            )}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={line.debit}
                                            onChange={(e) => updateLine(index, "debit", e.target.value)}
                                            size="small"
                                            inputProps={{ min: 0, step: 0.01 }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={line.credit}
                                            onChange={(e) => updateLine(index, "credit", e.target.value)}
                                            size="small"
                                            inputProps={{ min: 0, step: 0.01 }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={line.description}
                                            onChange={(e) => updateLine(index, "description", e.target.value)}
                                            size="small"
                                            fullWidth
                                            placeholder="بيان السطر"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => removeLine(index)}
                                            disabled={lines.length <= 2}
                                            size="small"
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Totals Row */}
                            <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                                <TableCell sx={{ textAlign: "right", fontWeight: "bold" }}>الإجمالي</TableCell>
                                <TableCell sx={{ textAlign: "right", fontWeight: "bold", color: isBalanced ? "green" : "red" }}>
                                    {totalDebit.toFixed(2)}
                                </TableCell>
                                <TableCell sx={{ textAlign: "right", fontWeight: "bold", color: isBalanced ? "green" : "red" }}>
                                    {totalCredit.toFixed(2)}
                                </TableCell>
                                <TableCell colSpan={2}>
                                    {!isBalanced && totalDebit > 0 && totalCredit > 0 && (
                                        <Typography variant="caption" color="error">
                                            الفرق: {Math.abs(totalDebit - totalCredit).toFixed(2)}
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <Button startIcon={<Add />} onClick={addLine} variant="outlined" size="small">
                        إضافة سطر
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions sx={{ direction: "rtl" }}>
                <Button onClick={handleClose} disabled={loading}>
                    إلغاء
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={loading || !isBalanced}>
                    {loading ? "جاري الحفظ..." : "حفظ القيد"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
