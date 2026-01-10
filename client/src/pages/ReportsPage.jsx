import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import reportsApi from "../api/reportsApi";

const ReportsPage = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalPurchases: 0,
        totalExpenses: 0,
        netProfit: 0,
    });
    const [topProducts, setTopProducts] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const [summaryRes, topProductsRes, lowStockRes] = await Promise.all([
                reportsApi.getSummary(params),
                reportsApi.getTopProducts(params),
                reportsApi.getLowStock(params), // Low stock usually doesn't depend on date range, but we pass it anyway or ignore
            ]);

            setSummary(summaryRes.data);
            setTopProducts(topProductsRes.data);
            setLowStockItems(lowStockRes.data);
        } catch (error) {
            console.error("Failed to fetch reports data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApplyFilter = () => {
        fetchData();
    };

    const handleMonthChange = (e) => {
        const month = e.target.value;
        const year = new Date().getFullYear();
        if (month) {
            const start = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const end = new Date(year, month, 0).toISOString().split('T')[0];
            setStartDate(start);
            setEndDate(end);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("ar-EG", {
            style: "currency",
            currency: "EGP",
        }).format(amount || 0);
    };

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                التقارير
            </Typography>

            {/* Filters */}
            <Box mb={4} display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>اختيار شهر سريع</InputLabel>
                    <Select
                        label="اختيار شهر سريع"
                        onChange={handleMonthChange}
                        defaultValue=""
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <MenuItem key={m} value={m}>
                                {new Date(0, m - 1).toLocaleString('ar-EG', { month: 'long' })}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="من تاريخ"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="إلى تاريخ"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="contained" onClick={handleApplyFilter}>
                    عرض التقرير
                </Button>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Summary Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: "#e3f2fd" }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        إجمالي المبيعات
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(summary.totalSales)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: "#fbe9e7" }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        إجمالي المشتريات
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(summary.totalPurchases)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: "#fff3e0" }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        إجمالي المصروفات
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(summary.totalExpenses)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ bgcolor: "#e8f5e9" }}>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        صافي الربح
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(summary.netProfit)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Tables */}
                    <Grid container spacing={3}>
                        {/* Top Products */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                المنتجات الأكثر مبيعاً
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>المنتج</TableCell>
                                            <TableCell>الكمية المباعة</TableCell>
                                            <TableCell>إجمالي الإيرادات</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topProducts.length > 0 ? (
                                            topProducts.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {item.product?.name}
                                                    </TableCell>
                                                    <TableCell>{item.total_quantity}</TableCell>
                                                    <TableCell>
                                                        {formatCurrency(item.total_revenue)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    لا توجد بيانات
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Low Stock */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                تحذيرات نفاد المخزون
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>المنتج</TableCell>
                                            <TableCell>الرصيد الحالي</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lowStockItems.length > 0 ? (
                                            lowStockItems.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {item.product?.name}
                                                    </TableCell>
                                                    <TableCell sx={{ color: "red", fontWeight: "bold" }}>
                                                        {item.total_balance}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">
                                                    المخزون جيد
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default ReportsPage;
