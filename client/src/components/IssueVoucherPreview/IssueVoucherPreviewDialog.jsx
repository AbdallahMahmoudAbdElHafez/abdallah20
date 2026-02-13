import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog, AppBar, Toolbar, IconButton, Typography,
    Button, Slide, Box, Divider, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import {
    Close as CloseIcon,
    Print as PrintIcon,
    FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import IssueVoucherPaper from './IssueVoucherPaper';
import '../InvoicePreview/InvoicePreview.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../../features/companies/companiesSlice';
import reportsApi from '../../api/reportsApi';
import { saveAs } from 'file-saver';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function IssueVoucherPreviewDialog({ open, onClose, voucher }) {
    const dispatch = useDispatch();
    const { items: companies } = useSelector((state) => state.companies);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [exportLoading, setExportLoading] = useState(false);
    const componentRef = useRef();

    useEffect(() => {
        if (open) {
            dispatch(fetchCompanies());
        }
    }, [open, dispatch]);

    useEffect(() => {
        if (companies.length > 0 && !selectedCompanyId) {
            setSelectedCompanyId(companies[0].id);
        }
    }, [companies, selectedCompanyId]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `IssueVoucher-${voucher?.voucher_no || 'draft'}`,
    });

    const selectedCompany = companies.find(c => c.id === selectedCompanyId) || {};

    const handleDownloadExcel = async () => {
        if (!voucher?.issue_date) return;
        try {
            setExportLoading(true);
            // Ensure date is in YYYY-MM-DD format
            const dateStr = voucher.issue_date.includes('T') ? voucher.issue_date.split('T')[0] : voucher.issue_date;

            const res = await reportsApi.exportReport('issue-vouchers', {
                startDate: dateStr,
                endDate: dateStr
            });
            const blob = new Blob([res.data], { type: 'application/octet-stream' });
            saveAs(blob, `IssueVoucher_${voucher.voucher_no}.xlsx`);
        } catch (error) {
            console.error('Error exporting single voucher:', error);
            alert('حدث خطأ أثناء التصدير');
        } finally {
            setExportLoading(false);
        }
    };

    if (!voucher) return null;

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        معاينة إذن الصرف: {voucher.voucher_no}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleDownloadExcel}
                        disabled={exportLoading}
                        startIcon={exportLoading ? null : <FileDownloadIcon />}
                    >
                        {exportLoading ? 'جاري التصدير...' : 'تصدير Excel'}
                    </Button>
                    <Button
                        color="inherit"
                        onClick={handlePrint}
                        startIcon={<PrintIcon />}
                        sx={{ ml: 2 }}
                    >
                        طباعة
                    </Button>
                </Toolbar>
            </AppBar>

            <div className="invoice-preview-container">
                {/* Sidebar Controls */}
                <div className="invoice-sidebar">
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>إعدادات العرض</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <FormControl fullWidth size="small">
                            <InputLabel>اختر الشركة</InputLabel>
                            <Select
                                value={selectedCompanyId}
                                label="اختر الشركة"
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                            >
                                {companies.map((company) => (
                                    <MenuItem key={company.id} value={company.id}>
                                        {company.company_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ mt: 'auto', p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            * المعاينة مطابقة تماماً لشكل الطباعة النهائي.
                        </Typography>
                    </Box>
                </div>

                {/* Main Preview Area */}
                <div className="invoice-main">
                    <div ref={componentRef}>
                        <IssueVoucherPaper
                            voucher={voucher}
                            company={selectedCompany}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
