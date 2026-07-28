import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, FormControl, Select, MenuItem, InputLabel, Alert
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import governatesApi from '../api/governatesApi';
import citiesApi from '../api/citiesApi';
import { saveAs } from 'file-saver';

const BatchCustomerStatementsPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [governates, setGovernates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedGovernate, setSelectedGovernate] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    
    // Default to current month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    useEffect(() => {
        fetchGovernates();
        fetchCities();
    }, []);

    const fetchGovernates = async () => {
        try {
            const res = await governatesApi.getAll();
            setGovernates(res.data);
        } catch (error) {
            console.error('Error fetching governates:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const res = await citiesApi.getAll();
            setCities(res.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const filteredCities = selectedGovernate 
        ? cities.filter(c => c.governate_id === selectedGovernate)
        : cities;

    const handleGovernateChange = (e) => {
        setSelectedGovernate(e.target.value);
        setSelectedCity(''); // reset city when governate changes
    };

    const fetchReport = async () => {
        if (!selectedGovernate && !selectedCity) {
            setError('يجب اختيار المحافظة أو المدينة على الأقل');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const res = await reportsApi.getBatchCustomerStatements({ 
                governate_id: selectedGovernate,
                city_id: selectedCity,
                startDate, 
                endDate 
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching batch statements:', error);
            setError('حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (!selectedGovernate && !selectedCity) {
            setError('يجب اختيار المحافظة أو المدينة على الأقل');
            return;
        }
        try {
            const response = await reportsApi.exportReport('batch-customer-statements', { 
                governate_id: selectedGovernate,
                city_id: selectedCity,
                startDate, 
                endDate 
            });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const filename = `كشوف_حساب_${startDate || 'all'}_to_${endDate || 'all'}.xlsx`;
            saveAs(blob, filename);
        } catch (error) {
            console.error('Export error:', error);
            setError('حدث خطأ أثناء تصدير التقرير');
        }
    };

    return (
        <Box sx={{ p: 3, direction: 'rtl' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button startIcon={<BackIcon />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                    عودة
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>كشوف حساب العملاء المجمعة</Typography>
            </Box>

            <Card sx={{ mb: 3, elevation: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المحافظة</InputLabel>
                                <Select
                                    value={selectedGovernate}
                                    label="المحافظة"
                                    onChange={handleGovernateChange}
                                >
                                    <MenuItem value="">الكل</MenuItem>
                                    {governates.map(g => (
                                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المدينة</InputLabel>
                                <Select
                                    value={selectedCity}
                                    label="المدينة"
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!selectedGovernate && cities.length === 0}
                                >
                                    <MenuItem value="">الكل</MenuItem>
                                    {filteredCities.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="من تاريخ"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="إلى تاريخ"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={fetchReport}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                                fullWidth
                            >
                                عرض
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={handleExportExcel}
                                startIcon={<DownloadIcon />}
                                fullWidth
                            >
                                Excel
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {data.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {data.map((stmt, idx) => (
                        <Paper key={idx} sx={{ p: 2, border: '2px solid #1A237E' }}>
                            <Typography variant="h5" sx={{ mb: 2, color: '#1A237E', fontWeight: 'bold' }}>
                                العميل: {stmt.customer?.name}
                            </Typography>
                            {/* We re-use CustomerStatement component and pass the statementData prop directly if it supports it, 
                                but the CustomerStatement component usually fetches its own data. 
                                We should display a simple table here instead, or modify CustomerStatement to accept data.
                            */}
                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#3F51B5', color: 'white' }}>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>التاريخ</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>البيان</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>مدين</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>دائن</th>
                                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>الرصيد</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }} colSpan={4}>الرصيد الافتتاحي</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>{stmt.opening_balance}</td>
                                        </tr>
                                        {stmt.statement && stmt.statement.map((row, i) => (
                                            <tr key={i}>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.date ? row.date.slice(0, 10) : ''}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.description}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.debit}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.credit}</td>
                                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{row.running_balance}</td>
                                            </tr>
                                        ))}
                                        <tr style={{ backgroundColor: '#E8EAF6', fontWeight: 'bold' }}>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }} colSpan={2}>الرصيد الختامي</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {stmt.statement.reduce((acc, curr) => acc + parseFloat(curr.debit || 0), 0)}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {stmt.statement.reduce((acc, curr) => acc + parseFloat(curr.credit || 0), 0)}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{stmt.closing_balance}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                !loading && <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 5 }}>لا توجد بيانات لعرضها. يرجى تحديد المحافظة/المدينة والضغط على عرض.</Typography>
            )}
        </Box>
    );
};

export default BatchCustomerStatementsPage;
