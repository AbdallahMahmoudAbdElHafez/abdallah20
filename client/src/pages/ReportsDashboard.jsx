import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import {
    Assessment as AssessmentIcon,
    ShoppingCart as SalesIcon,
    ShoppingBag as PurchasesIcon,
    AccountBalance as ExpensesIcon,
    Build as JobOrdersIcon,
    Store as WarehouseIcon,
    Receipt as VoucherIcon,
    AccountBalanceWallet as OpenBalanceIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReportsDashboard = () => {
    const navigate = useNavigate();

    const reports = [
        {
            title: 'تقرير المبيعات',
            description: 'تقرير تفصيلي عن جميع المبيعات مع رسوم بيانية',
            icon: <SalesIcon sx={{ fontSize: 60, color: '#2196f3' }} />,
            path: '/reports/sales',
            color: '#e3f2fd'
        },
        {
            title: 'تقرير المشتريات',
            description: 'تقرير تفصيلي عن جميع المشتريات مع رسوم بيانية',
            icon: <PurchasesIcon sx={{ fontSize: 60, color: '#ff9800' }} />,
            path: '/reports/purchases',
            color: '#fff3e0'
        },
        {
            title: 'تقرير المصروفات',
            description: 'تقرير تفصيلي عن جميع المصروفات مع رسوم بيانية',
            icon: <ExpensesIcon sx={{ fontSize: 60, color: '#f44336' }} />,
            path: '/reports/expenses',
            color: '#ffebee'
        },
        {
            title: 'تقرير أوامر التشغيل',
            description: 'تقرير تفصيلي عن جميع أوامر التشغيل مع رسوم بيانية',
            icon: <JobOrdersIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
            path: '/reports/job-orders',
            color: '#e8f5e9'
        },
        {
            title: 'تقرير المخازن',
            description: 'تقييم المخزون وتوزيع القيمة على المخازن',
            icon: <WarehouseIcon sx={{ fontSize: 60, color: '#9c27b0' }} />,
            path: '/reports/warehouse',
            color: '#f3e5f5'
        },
        {
            title: 'تقرير أذونات الصرف',
            description: 'تقرير تفصيلي عن أذونات الصرف وتكلفة المصروفات',
            icon: <VoucherIcon sx={{ fontSize: 60, color: '#fbc02d' }} />,
            path: '/reports/issue-vouchers',
            color: '#fffde7'
        },
        {
            title: 'فواتير المبيعات الافتتاحية',
            description: 'عرض جميع فواتير الأرصدة الافتتاحية للعملاء',
            icon: <OpenBalanceIcon sx={{ fontSize: 60, color: '#00bcd4' }} />,
            path: '/reports/opening-sales',
            color: '#e0f7fa'
        }
    ];

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                <AssessmentIcon sx={{ fontSize: 40, mr: 1, verticalAlign: 'middle' }} />
                إعداد التقارير
            </Typography>

            <Grid container spacing={3}>
                {reports.map((report, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: report.color,
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Box sx={{ mb: 2 }}>
                                    {report.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {report.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {report.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(report.path)}
                                    sx={{ minWidth: 150 }}
                                >
                                    عرض التقرير
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReportsDashboard;
