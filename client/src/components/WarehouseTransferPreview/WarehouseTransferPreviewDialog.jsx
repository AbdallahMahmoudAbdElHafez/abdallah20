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
import WarehouseTransferPaper from './WarehouseTransferPaper';
import '../InvoicePreview/InvoicePreview.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../../features/companies/companiesSlice';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function WarehouseTransferPreviewDialog({ open, onClose, transfer }) {
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
        documentTitle: `WarehouseTransfer-${transfer?.id || 'draft'}`,
    });

    const selectedCompany = companies.find(c => c.id === selectedCompanyId) || {};

    const handleDownloadExcel = async () => {
        if (!transfer) return;
        try {
            setExportLoading(true);

            const workbook = new ExcelJS.Workbook();
            const ws = workbook.addWorksheet('إذن تحويل', {
                views: [{ rightToLeft: true }]
            });

            // --- Header Info ---
            ws.mergeCells('A1:E1');
            const titleCell = ws.getCell('A1');
            titleCell.value = selectedCompany?.company_name || 'إذن تحويل مخزني';
            titleCell.font = { bold: true, size: 16 };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            ws.getRow(1).height = 30;

            ws.mergeCells('A2:E2');
            const subTitle = ws.getCell('A2');
            subTitle.value = 'إذن تحويل مخزني';
            subTitle.font = { bold: true, size: 14, color: { argb: 'FF2c3e50' } };
            subTitle.alignment = { horizontal: 'center' };

            // Transfer metadata
            ws.getRow(4).values = ['', '', '', 'رقم التحويل:', transfer.id];
            ws.getRow(5).values = ['', '', '', 'التاريخ:', transfer.transfer_date
                ? new Date(transfer.transfer_date).toLocaleDateString('ar-EG')
                : '—'];
            ws.getRow(6).values = ['', '', '', 'من مخزن:', transfer.fromWarehouse?.name || '—'];
            ws.getRow(7).values = ['', '', '', 'إلى مخزن:', transfer.toWarehouse?.name || '—'];

            [4, 5, 6, 7].forEach(r => {
                ws.getRow(r).getCell(4).font = { bold: true };
                ws.getRow(r).getCell(4).alignment = { horizontal: 'right' };
                ws.getRow(r).getCell(5).alignment = { horizontal: 'right' };
            });

            // --- Items Table ---
            const headerRow = ws.getRow(9);
            headerRow.values = ['#', 'اسم المنتج', 'الكمية', 'تكلفة الوحدة', 'الإجمالي'];
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
            headerRow.height = 25;
            for (let c = 1; c <= 5; c++) {
                headerRow.getCell(c).fill = {
                    type: 'pattern', pattern: 'solid',
                    fgColor: { argb: 'FF2c3e50' }
                };
                headerRow.getCell(c).border = {
                    top: { style: 'thin' }, left: { style: 'thin' },
                    bottom: { style: 'thin' }, right: { style: 'thin' }
                };
            }

            // Column widths
            ws.getColumn(1).width = 6;
            ws.getColumn(2).width = 35;
            ws.getColumn(3).width = 12;
            ws.getColumn(4).width = 18;
            ws.getColumn(5).width = 18;

            const items = transfer.items || [];
            let grandTotal = 0;

            items.forEach((item, idx) => {
                const qty = Number(item.quantity) || 0;
                const cost = Number(item.cost_per_unit) || 0;
                const total = qty * cost;
                grandTotal += total;

                const row = ws.getRow(10 + idx);
                row.values = [
                    idx + 1,
                    item.product?.name || item.product_name || 'منتج غير معروف',
                    qty,
                    cost,
                    total
                ];
                row.alignment = { horizontal: 'center', vertical: 'middle' };
                row.getCell(2).alignment = { horizontal: 'right' };

                // Alternate row colors
                if (idx % 2 === 0) {
                    for (let c = 1; c <= 5; c++) {
                        row.getCell(c).fill = {
                            type: 'pattern', pattern: 'solid',
                            fgColor: { argb: 'FFF9FAFB' }
                        };
                    }
                }

                // Number formatting
                row.getCell(4).numFmt = '#,##0.00';
                row.getCell(5).numFmt = '#,##0.00';

                // Borders
                for (let c = 1; c <= 5; c++) {
                    row.getCell(c).border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };
                }
            });

            // Total row
            const totalRowNum = 10 + items.length;
            const totalRow = ws.getRow(totalRowNum);
            totalRow.values = ['', 'الإجمالي', '', '', grandTotal];
            totalRow.font = { bold: true, size: 12 };
            totalRow.getCell(5).numFmt = '#,##0.00';
            totalRow.getCell(2).alignment = { horizontal: 'right' };
            totalRow.getCell(5).alignment = { horizontal: 'center' };
            for (let c = 1; c <= 5; c++) {
                totalRow.getCell(c).fill = {
                    type: 'pattern', pattern: 'solid',
                    fgColor: { argb: 'FFE8EAF6' }
                };
                totalRow.getCell(c).border = {
                    top: { style: 'medium', color: { argb: 'FF2c3e50' } },
                    bottom: { style: 'medium', color: { argb: 'FF2c3e50' } }
                };
            }

            // Notes
            if (transfer.note) {
                const noteRowNum = totalRowNum + 2;
                ws.getRow(noteRowNum).values = ['', 'ملاحظات:'];
                ws.getRow(noteRowNum).font = { bold: true };
                ws.getRow(noteRowNum + 1).values = ['', transfer.note];
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            saveAs(blob, `إذن_تحويل_${transfer.id}.xlsx`);
        } catch (error) {
            console.error('Error exporting transfer to Excel:', error);
            alert('حدث خطأ أثناء التصدير');
        } finally {
            setExportLoading(false);
        }
    };

    if (!transfer) return null;

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        معاينة إذن التحويل: {transfer.id}
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
                        <WarehouseTransferPaper
                            transfer={transfer}
                            company={selectedCompany}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
