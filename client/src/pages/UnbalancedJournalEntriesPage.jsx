import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button
} from "@mui/material";
import reportsApi from "../api/reportsApi";
import { useNavigate } from "react-router-dom";

const UnbalancedJournalEntriesPage = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchEntries = async () => {
        setLoading(true);
        try {
            const { data } = await reportsApi.getUnbalancedJournalEntries();
            setEntries(data);
        } catch (error) {
            console.error("Failed to fetch unbalanced journal entries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("ar-EG", {
            style: "currency",
            currency: "EGP",
        }).format(amount || 0);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                القيود اليومية غير المتوازنة
            </Typography>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        يعرض هذا التقرير جميع القيود المحاسبية التي يكون فيها مجموع الجانب المدين لا يساوي مجموع الجانب الدائن.
                    </Typography>
                </CardContent>
            </Card>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell>رقم القيد</TableCell>
                                <TableCell>التاريخ</TableCell>
                                <TableCell>المرجع</TableCell>
                                <TableCell>رقم المرجع</TableCell>
                                <TableCell>الوصف</TableCell>
                                <TableCell>المدين</TableCell>
                                <TableCell>الدائن</TableCell>
                                <TableCell>الفرق</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {entries.length > 0 ? (
                                entries.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{entry.id}</TableCell>
                                        <TableCell>{entry.entry_date}</TableCell>
                                        <TableCell>{entry.reference_type}</TableCell>
                                        <TableCell>{entry.reference_id || "-"}</TableCell>
                                        <TableCell>{entry.description || "-"}</TableCell>
                                        <TableCell sx={{ color: "success.main", fontWeight: 'bold' }}>
                                            {formatCurrency(entry.total_debit)}
                                        </TableCell>
                                        <TableCell sx={{ color: "error.main", fontWeight: 'bold' }}>
                                            {formatCurrency(entry.total_credit)}
                                        </TableCell>
                                        <TableCell sx={{ color: "warning.main", fontWeight: 'bold' }}>
                                            {formatCurrency(entry.difference)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        لا توجد قيود غير متوازنة. جميع القيود متوازنة بشكل صحيح.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default UnbalancedJournalEntriesPage;
