import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, FormControl, Select, MenuItem, InputLabel,
    Alert, Chip, Divider, Collapse, IconButton, Tooltip, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    LinearProgress, Badge
} from '@mui/material';
import {
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    AccountCircle as CustomerIcon,
    LocationOn as LocationIcon,
    Assessment as AssessmentIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    People as PeopleIcon,
    MonetizationOn as MoneyIcon,
    FilterList as FilterIcon,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import governatesApi from '../api/governatesApi';
import citiesApi from '../api/citiesApi';
import { saveAs } from 'file-saver';

// ─── Color helpers ───────────────────────────────────────────────────────────
const ROW_COLORS = {
    invoice:     { bg: '#E3F2FD', label: 'فاتورة',   chip: 'primary' },
    payment:     { bg: '#E8F5E9', label: 'سداد',     chip: 'success' },
    return:      { bg: '#FFF8E1', label: 'مرتجع',    chip: 'warning' },
    refund:      { bg: '#FCE4EC', label: 'رد نقدي',  chip: 'error'   },
    replacement: { bg: '#F3E5F5', label: 'استبدال',  chip: 'secondary' },
};

const fmt = (n) => Number(n || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Single transaction row with collapsible items ───────────────────────────
function TransactionRow({ row }) {
    const [openItems, setOpenItems] = useState(false);
    const hasItems = row.items && row.items.length > 0;
    const meta = ROW_COLORS[row.type] || { bg: '#fff', label: row.type, chip: 'default' };

    return (
        <>
            <TableRow
                onClick={() => hasItems && setOpenItems(!openItems)}
                sx={{
                    bgcolor: meta.bg,
                    cursor: hasItems ? 'pointer' : 'default',
                    '&:hover': { filter: 'brightness(0.97)' },
                    transition: 'filter 0.1s'
                }}
            >
                <TableCell align="center" sx={{ width: 40, py: 0.8 }}>
                    {hasItems && (
                        <IconButton size="small">
                            {openItems ? <KeyboardArrowUp sx={{ fontSize: 18 }} /> : <KeyboardArrowDown sx={{ fontSize: 18 }} />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 12.5, py: 0.8, color: '#37474F', minWidth: 100 }}>
                    {row.date ? row.date.slice(0, 10) : '—'}
                </TableCell>
                <TableCell align="center" sx={{ py: 0.8 }}>
                    <Chip
                        label={meta.label}
                        color={meta.chip}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 11 }}
                    />
                </TableCell>
                <TableCell align="right" sx={{ fontSize: 12.5, py: 0.8, maxWidth: 280 }}>
                    {row.description}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 13, py: 0.8, fontWeight: row.debit ? 600 : 400, color: '#0D47A1' }}>
                    {row.debit ? fmt(row.debit) : '—'}
                </TableCell>
                <TableCell align="center" sx={{ fontSize: 13, py: 0.8, fontWeight: row.credit ? 600 : 400, color: '#1B5E20' }}>
                    {row.credit ? fmt(row.credit) : '—'}
                </TableCell>
                <TableCell align="center" sx={{
                    fontSize: 13, py: 0.8, fontWeight: 700,
                    color: row.running_balance > 0 ? '#B71C1C' : row.running_balance < 0 ? '#1B5E20' : '#616161'
                }}>
                    {fmt(row.running_balance)}
                </TableCell>
            </TableRow>

            {hasItems && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={openItems} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, padding: 1.5, bgcolor: '#fbfbfb', borderRadius: 1.5, border: '1px solid #e8e8e8' }}>
                                <Typography variant="subtitle2" gutterBottom fontWeight="bold" color="text.secondary" sx={{ mb: 1 }}>
                                    تفاصيل الأصناف للـ {meta.label}:
                                </Typography>
                                <Table size="small" sx={{ direction: 'rtl' }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#eceff1' }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>اسم المنتج</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="center">الكمية</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="center">السعر</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="center">الإجمالي</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ fontSize: 12 }}>{item.product_name}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: 12 }}>{item.quantity}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: 12 }}>{fmt(item.price)}</TableCell>
                                                <TableCell align="center" sx={{ fontSize: 12, fontWeight: 'bold' }}>{fmt(item.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

// ─── Single customer statement accordion ─────────────────────────────────────
function CustomerStatementRow({ stmt, index }) {
    const [open, setOpen] = useState(false);

    const totalDebit  = useMemo(() => stmt.statement.reduce((a, r) => a + Number(r.debit  || 0), 0), [stmt]);
    const totalCredit = useMemo(() => stmt.statement.reduce((a, r) => a + Number(r.credit || 0), 0), [stmt]);
    const closing     = Number(stmt.closing_balance || 0);
    const isDebtor    = closing > 0;
    const isClear     = closing === 0;

    return (
        <Paper
            elevation={open ? 4 : 1}
            sx={{
                mb: 1.5,
                borderRadius: 2,
                overflow: 'hidden',
                border: open ? '1.5px solid #3F51B5' : '1px solid #e0e0e0',
                transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
        >
            {/* Header row */}
            <Box
                onClick={() => setOpen(!open)}
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 2.5, py: 1.5,
                    bgcolor: open ? '#E8EAF6' : (index % 2 === 0 ? '#FAFAFA' : '#FFFFFF'),
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#EDE7F6' },
                    transition: 'background-color 0.15s',
                }}
            >
                {/* Left: index + name */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                        sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            bgcolor: '#3F51B5', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', fontSize: 13, flexShrink: 0
                        }}
                    >
                        {index + 1}
                    </Box>
                    <Box>
                        <Typography fontWeight="bold" fontSize={15} color="text.primary">
                            {stmt.customer?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {stmt.statement.length} حركة
                        </Typography>
                    </Box>
                </Stack>

                {/* Right: financial summary chips */}
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" justifyContent="flex-end">
                    <Chip
                        size="small"
                        label={`مدين: ${fmt(totalDebit)}`}
                        sx={{ bgcolor: '#E3F2FD', color: '#0D47A1', fontWeight: 600, fontSize: 12 }}
                    />
                    <Chip
                        size="small"
                        label={`دائن: ${fmt(totalCredit)}`}
                        sx={{ bgcolor: '#E8F5E9', color: '#1B5E20', fontWeight: 600, fontSize: 12 }}
                    />
                    <Chip
                        size="small"
                        icon={isDebtor ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : (isClear ? null : <TrendingDownIcon sx={{ fontSize: 14 }} />)}
                        label={`الرصيد: ${fmt(closing)}`}
                        sx={{
                            bgcolor: isDebtor ? '#FFEBEE' : isClear ? '#F5F5F5' : '#E8F5E9',
                            color: isDebtor ? '#B71C1C' : isClear ? '#616161' : '#1B5E20',
                            fontWeight: 700, fontSize: 12
                        }}
                    />
                    <IconButton size="small" sx={{ ml: 1 }}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </Stack>
            </Box>

            {/* Collapsible detail table */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ p: 0 }}>
                    {/* Opening balance bar */}
                    <Box sx={{ px: 2.5, py: 1, bgcolor: '#F0F4FF', borderBottom: '1px solid #e8e8e8' }}>
                        <Typography variant="body2" color="text.secondary">
                            الرصيد الافتتاحي:{' '}
                            <Typography component="span" fontWeight="bold" color="primary">
                                {fmt(stmt.opening_balance)}
                            </Typography>
                        </Typography>
                    </Box>

                    <TableContainer>
                        <Table size="small" sx={{ direction: 'rtl' }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#3F51B5' }}>
                                    {['', 'التاريخ', 'النوع', 'البيان', 'مدين', 'دائن', 'الرصيد'].map((h, hIdx) => (
                                        <TableCell
                                            key={hIdx}
                                            align="center"
                                            sx={{ color: '#fff', fontWeight: 'bold', fontSize: 12.5, py: 1, borderColor: '#5C6BC0' }}
                                        >
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stmt.statement.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ color: '#9e9e9e', py: 3 }}>
                                            لا توجد حركات في هذه الفترة
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stmt.statement.map((row, i) => (
                                        <TransactionRow key={i} row={row} />
                                    ))
                                )}

                                {/* Totals row */}
                                <TableRow sx={{ bgcolor: '#E8EAF6' }}>
                                    <TableCell colSpan={3} align="center" sx={{ fontWeight: 'bold', py: 1, fontSize: 13, borderTop: '2px solid #3F51B5' }}>
                                        الإجمالي
                                    </TableCell>
                                    <TableCell sx={{ borderTop: '2px solid #3F51B5' }} />
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#0D47A1', fontSize: 13, borderTop: '2px solid #3F51B5' }}>
                                        {fmt(totalDebit)}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1B5E20', fontSize: 13, borderTop: '2px solid #3F51B5' }}>
                                        {fmt(totalCredit)}
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        fontWeight: 'bold', fontSize: 14, borderTop: '2px solid #3F51B5',
                                        color: isDebtor ? '#B71C1C' : isClear ? '#616161' : '#1B5E20'
                                    }}>
                                        {fmt(closing)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Collapse>
        </Paper>
    );
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, color, bgColor }) {
    return (
        <Card elevation={2} sx={{ bgcolor: bgColor, borderRadius: 2, border: `1.5px solid ${color}22` }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ color, fontSize: 36 }}>{icon}</Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
                        <Typography variant="h6" fontWeight="bold" color={color} lineHeight={1.2}>
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const BatchCustomerStatementsPage = () => {
    const navigate = useNavigate();
    const [data, setData]           = useState([]);
    const [loading, setLoading]     = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError]         = useState('');
    const [searched, setSearched]   = useState(false);

    const [governates, setGovernates] = useState([]);
    const [cities, setCities]         = useState([]);
    const [selectedGovernate, setSelectedGovernate] = useState('');
    const [selectedCity, setSelectedCity]           = useState('');

    // Default: current month
    const today     = new Date();
    const firstDay  = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay   = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate]     = useState(lastDay);

    useEffect(() => {
        governatesApi.getAll().then(r => setGovernates(r.data)).catch(console.error);
        citiesApi.getAll().then(r => setCities(r.data)).catch(console.error);
    }, []);

    const filteredCities = selectedGovernate
        ? cities.filter(c => c.governate_id === selectedGovernate)
        : cities;

    // Region label for display
    const regionLabel = useMemo(() => {
        if (selectedCity) {
            const c = cities.find(x => x.id === selectedCity);
            return c ? `مدينة: ${c.name}` : '';
        }
        if (selectedGovernate) {
            const g = governates.find(x => x.id === selectedGovernate);
            return g ? `محافظة: ${g.name}` : '';
        }
        return 'كل المناطق';
    }, [selectedGovernate, selectedCity, governates, cities]);

    // Aggregated summary
    const summary = useMemo(() => {
        if (!data.length) return null;
        const totalDebit  = data.reduce((s, stmt) => s + stmt.statement.reduce((a, r) => a + Number(r.debit  || 0), 0), 0);
        const totalCredit = data.reduce((s, stmt) => s + stmt.statement.reduce((a, r) => a + Number(r.credit || 0), 0), 0);
        const totalBalance = data.reduce((s, stmt) => s + Number(stmt.closing_balance || 0), 0);
        const debtors     = data.filter(stmt => Number(stmt.closing_balance || 0) > 0).length;
        return { totalDebit, totalCredit, totalBalance, debtors, count: data.length };
    }, [data]);

    const fetchReport = async () => {
        if (!selectedGovernate && !selectedCity) {
            setError('يجب اختيار المحافظة أو المدينة على الأقل');
            return;
        }
        setError('');
        setLoading(true);
        setSearched(false);
        setData([]);
        try {
            const res = await reportsApi.getBatchCustomerStatements({
                governate_id: selectedGovernate,
                city_id: selectedCity,
                startDate,
                endDate
            });
            setData(res.data);
            setSearched(true);
        } catch (err) {
            console.error(err);
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
        setExporting(true);
        setError('');
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
            const filename = `كشوف_حساب_${regionLabel}_${startDate}_${endDate}.xlsx`;
            saveAs(blob, filename);
        } catch (err) {
            console.error(err);
            setError('حدث خطأ أثناء تصدير التقرير');
        } finally {
            setExporting(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, direction: 'rtl', maxWidth: 1400, mx: 'auto' }}>

            {/* Page header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    عودة
                </Button>
                <Box>
                    <Typography variant="h5" fontWeight="bold" color="primary.dark">
                        <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 0.5, mb: 0.3 }} />
                        كشوف حساب العملاء التفصيلية
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        استعراض وتصدير كشوف حسابات جميع عملاء منطقة بعينها دفعة واحدة
                    </Typography>
                </Box>
            </Box>

            {/* Filter card */}
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, border: '1px solid #E8EAF6' }}>
                <CardContent sx={{ pb: '16px !important' }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                        <FilterIcon color="primary" />
                        <Typography fontWeight="bold" color="primary.dark">فلاتر البحث</Typography>
                    </Stack>
                    <Grid container spacing={2} alignItems="flex-end">
                        {/* Governate */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المحافظة</InputLabel>
                                <Select
                                    value={selectedGovernate}
                                    label="المحافظة"
                                    onChange={e => { setSelectedGovernate(e.target.value); setSelectedCity(''); }}
                                >
                                    <MenuItem value=""><em>اختر المحافظة...</em></MenuItem>
                                    {governates.map(g => (
                                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* City */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>المدينة / المنطقة</InputLabel>
                                <Select
                                    value={selectedCity}
                                    label="المدينة / المنطقة"
                                    onChange={e => setSelectedCity(e.target.value)}
                                    disabled={filteredCities.length === 0}
                                >
                                    <MenuItem value=""><em>كل مدن المحافظة</em></MenuItem>
                                    {filteredCities.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* From date */}
                        <Grid item xs={6} sm={3} md={2}>
                            <TextField
                                fullWidth type="date" label="من تاريخ"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>

                        {/* To date */}
                        <Grid item xs={6} sm={3} md={2}>
                            <TextField
                                fullWidth type="date" label="إلى تاريخ"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>

                        {/* Buttons */}
                        <Grid item xs={12} sm={12} md={2}>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={fetchReport}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
                                    fullWidth
                                    sx={{ borderRadius: 2, py: 1, fontWeight: 'bold' }}
                                >
                                    عرض
                                </Button>
                                <Tooltip title="تصدير Excel (ورقة لكل عميل)">
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        onClick={handleExportExcel}
                                        disabled={exporting || loading}
                                        startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
                                        fullWidth
                                        sx={{ borderRadius: 2, py: 1, fontWeight: 'bold' }}
                                    >
                                        Excel
                                    </Button>
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
                {loading && <LinearProgress sx={{ borderRadius: '0 0 8px 8px' }} />}
            </Card>

            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

            {/* Summary cards */}
            {summary && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationIcon color="primary" />
                            <Typography fontWeight="bold" color="primary.dark">{regionLabel}</Typography>
                            <Chip label={`${summary.count} عميل`} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SummaryCard
                            icon={<PeopleIcon fontSize="inherit" />}
                            label="إجمالي العملاء"
                            value={summary.count}
                            color="#1565C0"
                            bgColor="#E3F2FD"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SummaryCard
                            icon={<TrendingUpIcon fontSize="inherit" />}
                            label="إجمالي المديونيات"
                            value={fmt(summary.totalDebit)}
                            color="#0D47A1"
                            bgColor="#BBDEFB"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SummaryCard
                            icon={<TrendingDownIcon fontSize="inherit" />}
                            label="إجمالي المدفوعات"
                            value={fmt(summary.totalCredit)}
                            color="#1B5E20"
                            bgColor="#C8E6C9"
                        />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <SummaryCard
                            icon={<MoneyIcon fontSize="inherit" />}
                            label="صافي المستحق"
                            value={fmt(summary.totalBalance)}
                            color={summary.totalBalance > 0 ? '#B71C1C' : '#1B5E20'}
                            bgColor={summary.totalBalance > 0 ? '#FFEBEE' : '#E8F5E9'}
                        />
                    </Grid>
                </Grid>
            )}

            {/* Results */}
            {data.length > 0 ? (
                <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                            كشوف الحسابات التفصيلية — انقر على أي عميل لعرض حركاته
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {data.length} عميل
                        </Typography>
                    </Stack>

                    {data.map((stmt, idx) => (
                        <CustomerStatementRow key={stmt.customer?.id || idx} stmt={stmt} index={idx} />
                    ))}
                </Box>
            ) : (
                searched && !loading && (
                    <Paper elevation={0} sx={{ py: 6, textAlign: 'center', bgcolor: '#FAFAFA', borderRadius: 3, border: '1px dashed #BDBDBD' }}>
                        <PeopleIcon sx={{ fontSize: 64, color: '#BDBDBD', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary">
                            لا يوجد عملاء في هذه المنطقة بالفترة المحددة
                        </Typography>
                        <Typography variant="body2" color="text.disabled" mt={0.5}>
                            جرب اختيار محافظة أو مدينة مختلفة
                        </Typography>
                    </Paper>
                )
            )}

            {/* Initial state */}
            {!searched && !loading && data.length === 0 && (
                <Paper elevation={0} sx={{ py: 8, textAlign: 'center', bgcolor: '#F5F5F5', borderRadius: 3, border: '1px dashed #BDBDBD' }}>
                    <LocationIcon sx={{ fontSize: 70, color: '#C5CAE9', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="bold">
                        اختر المحافظة أو المدينة ثم اضغط «عرض»
                    </Typography>
                    <Typography variant="body2" color="text.disabled" mt={0.5}>
                        سيتم استرجاع كشف حساب تفصيلي لجميع عملاء المنطقة المحددة
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default BatchCustomerStatementsPage;
