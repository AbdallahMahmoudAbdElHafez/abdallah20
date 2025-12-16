import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Slide,
    Box,
    Switch,
    FormControlLabel,
    Checkbox,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Close as CloseIcon, Print as PrintIcon, FileDownload as FileDownloadIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import InvoicePaper from './InvoicePaper';
import './InvoicePreview.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '../../features/companies/companiesSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function InvoicePreviewDialog({ open, onClose, invoice, items, type = 'sales' }) {
    const dispatch = useDispatch();
    const { items: companies } = useSelector((state) => state.companies);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');

    // Initial Columns State
    const [columns, setColumns] = useState([
        { key: 'product', label: 'المنتج', visible: true },
        { key: 'quantity', label: 'الكمية', visible: true },
        { key: 'unit_price', label: 'سعر الوحدة', visible: true },
        { key: 'total_before_discount', label: 'الإجمالي قبل الخصم', visible: true },
        { key: 'bonus', label: 'بونص', visible: true },
        { key: 'discount_percent', label: 'نسبة الخصم', visible: true },
        { key: 'discount', label: 'قيمة الخصم', visible: true },
        { key: 'tax', label: 'الضريبة', visible: true },
        { key: 'total', label: 'الإجمالي', visible: true },
    ]);

    const [showCompanyAddress, setShowCompanyAddress] = useState(true);
    const [showCompanyIds, setShowCompanyIds] = useState(true);

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

    // Reset columns when dialog opens
    useEffect(() => {
        if (open) {
            setColumns([
                { key: 'product', label: 'المنتج', visible: true },
                { key: 'quantity', label: 'الكمية', visible: true },
                { key: 'unit_price', label: 'سعر الوحدة', visible: true },
                { key: 'total_before_discount', label: 'الإجمالي قبل الخصم', visible: true },
                { key: 'bonus', label: 'بونص', visible: true },
                { key: 'discount_percent', label: 'نسبة الخصم', visible: true },
                { key: 'discount', label: 'قيمة الخصم', visible: true },
                { key: 'tax', label: 'الضريبة', visible: false }, // Default hidden
                { key: 'total', label: 'الإجمالي', visible: true },
            ]);
        }
    }, [open]);

    const handleToggleColumn = (key) => {
        setColumns(prev => prev.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice-${invoice?.invoice_number || 'draft'}`,
    });

    const selectedCompany = companies.find(c => c.id === selectedCompanyId) || {};

    const handleExportExcel = async () => {
        if (!invoice || !items) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Invoice', {
            views: [{ rightToLeft: true }]
        });

        // --- Styles ---
        const headerFont = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF2C3E50' } };
        const labelFont = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF7F8C8D' } };
        const valFont = { name: 'Arial', size: 10 };
        const tableHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        const tableHeaderFont = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        // --- Define Columns First (to determine width) ---
        const visibleCols = columns.filter(c => c.visible);
        const wsColumns = [
            { header: '#', key: 'index', width: 5 },
        ];
        if (visibleCols.find(c => c.key === 'product')) wsColumns.push({ header: 'المنتج', key: 'product', width: 30 });
        if (visibleCols.find(c => c.key === 'quantity')) wsColumns.push({ header: 'الكمية', key: 'quantity', width: 10 });
        if (visibleCols.find(c => c.key === 'unit_price')) wsColumns.push({ header: 'سعر الوحدة', key: 'unit_price', width: 15 });
        if (visibleCols.find(c => c.key === 'total_before_discount')) wsColumns.push({ header: 'الإجمالي قبل الخصم', key: 'total_before_discount', width: 15 });
        if (visibleCols.find(c => c.key === 'bonus')) wsColumns.push({ header: 'بونص', key: 'bonus', width: 10 });
        if (visibleCols.find(c => c.key === 'discount_percent')) wsColumns.push({ header: 'نسبة الخصم', key: 'discount_percent', width: 12 });
        if (visibleCols.find(c => c.key === 'discount')) wsColumns.push({ header: 'قيمة الخصم', key: 'discount', width: 12 });
        if (visibleCols.find(c => c.key === 'tax')) wsColumns.push({ header: 'الضريبة', key: 'tax', width: 10 });
        if (visibleCols.find(c => c.key === 'total')) wsColumns.push({ header: 'الإجمالي', key: 'total', width: 15 });

        // --- 1. Header (Company Info & Logo) ---
        // Add Logo if exists
        if (selectedCompany.logo_path) {
            try {
                const response = await fetch(`http://localhost:5000/${selectedCompany.logo_path}`);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();

                const imageId = workbook.addImage({
                    buffer: buffer,
                    extension: 'png', // Assuming png/jpg, exceljs handles standard types
                });

                // In RTL, column 0 is Right. Last column is Left.
                // Place logo at the far left (last column)
                const logoColIndex = wsColumns.length - 1;

                worksheet.addImage(imageId, {
                    tl: { col: logoColIndex - 1, row: 0 }, // Spanning last 2 columns roughly
                    ext: { width: 180, height: 100 },
                    editAs: 'oneCell'
                });
            } catch (error) {
                console.error("Error fetching logo for excel:", error);
            }
        }

        // Company Name at Far Right (Column A in RTL)
        worksheet.mergeCells('A1:C1'); // Reduced merge to keep it right-aligned visually
        const titleCell = worksheet.getCell('A1');
        titleCell.value = selectedCompany.company_name || 'شركة نوريفيناء';
        titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF2C3E50' } };
        titleCell.alignment = { horizontal: 'right', vertical: 'middle' }; // Right align in cell

        worksheet.mergeCells('A2:E2'); // Subtitle can span more
        const subTitle = worksheet.getCell('A2');

        let companyDetails = [selectedCompany.city?.name];

        if (showCompanyAddress) {
            companyDetails.push(selectedCompany.address);
        }

        companyDetails.push(selectedCompany.phone && `هاتف: ${selectedCompany.phone}`);

        if (showCompanyIds) {
            if (selectedCompany.commercial_register) companyDetails.push(`س.ت: ${selectedCompany.commercial_register}`);
            if (selectedCompany.tax_number) companyDetails.push(`ر.ض: ${selectedCompany.tax_number}`);
            if (selectedCompany.vat_number) companyDetails.push(`ر.ض.ق.م: ${selectedCompany.vat_number}`);
        }

        subTitle.value = companyDetails.filter(Boolean).join(' | ') || 'الرياض، المملكة العربية السعودية | هاتف: 011-1234567';
        subTitle.font = { name: 'Arial', size: 9, color: { argb: 'FF7F8C8D' } };
        subTitle.alignment = { horizontal: 'right' }; // Right align subtitle too

        // Spacer (Make it bigger for logo)
        worksheet.getRow(1).height = 100; // Match logo height
        worksheet.addRow([]);

        // --- 2. Invoice Meta ---
        const metaStartRow = 4;
        worksheet.getRow(metaStartRow).values = ['رقم الفاتورة:', invoice.invoice_number, '', 'فاتورة إلى:', invoice.party?.name || invoice.supplier?.name || "N/A"];
        worksheet.getRow(metaStartRow).font = labelFont;
        worksheet.getCell(`B${metaStartRow}`).font = { bold: true };
        worksheet.getCell(`D${metaStartRow}`).font = labelFont;
        worksheet.getCell(`E${metaStartRow}`).font = { bold: true };

        // Removed Status Row as per request, just showing Date and Phone/Address
        worksheet.getRow(metaStartRow + 1).values = ['التاريخ:', invoice.invoice_date, '', 'العنوان:', invoice.party?.address || invoice.supplier?.address || "-"];
        worksheet.getRow(metaStartRow + 2).values = ['الهاتف:', invoice.party?.phone || invoice.supplier?.phone || "-", '', '', ''];

        // Spacer
        worksheet.addRow([]);
        worksheet.addRow([]);

        // --- 3. Items Table ---
        // Manually Add Header Row to apply styles easily
        const headerRow = worksheet.addRow(wsColumns.map(c => c.header));
        headerRow.eachCell((cell) => {
            cell.fill = tableHeaderFill;
            cell.font = tableHeaderFont;
            cell.alignment = { horizontal: 'center' };
            cell.border = borderStyle;
        });

        // Add Data
        items.forEach((item, index) => {
            const rowData = [(index + 1)];
            const qty = Number(item.quantity) || 0;
            const price = Number(item.price || item.unit_price) || 0;
            const discountVal = Number(item.discount) || 0;
            const bonus = Number(item.bonus) || 0;
            const totalBeforeDiscount = qty * price;

            // Calc percent if needed
            let discountPercent = Number(item.discount_percent);
            if (isNaN(discountPercent) && price > 0 && qty > 0) {
                discountPercent = (discountVal / (qty * price)) * 100;
            }
            discountPercent = discountPercent || 0;

            if (visibleCols.find(c => c.key === 'product')) rowData.push(item.product_name || item.Product?.name);
            if (visibleCols.find(c => c.key === 'quantity')) rowData.push(qty);
            if (visibleCols.find(c => c.key === 'unit_price')) rowData.push(price);
            if (visibleCols.find(c => c.key === 'total_before_discount')) rowData.push(totalBeforeDiscount);
            if (visibleCols.find(c => c.key === 'bonus')) rowData.push(bonus);
            if (visibleCols.find(c => c.key === 'discount_percent')) rowData.push(`${discountPercent.toFixed(2)}%`);
            if (visibleCols.find(c => c.key === 'discount')) rowData.push(discountVal);
            if (visibleCols.find(c => c.key === 'tax')) rowData.push(0); // Placeholder
            if (visibleCols.find(c => c.key === 'total')) rowData.push(((qty * price) - discountVal));

            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                cell.border = borderStyle;
                cell.alignment = { horizontal: 'center' };
            });
        });

        // Auto Fit Columns
        worksheet.columns.forEach((column) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        });

        // Spacer
        worksheet.addRow([]);

        // --- 4. Totals ---
        const totalStartRow = worksheet.lastRow.number + 1;
        const totalLabelCol = wsColumns.length - 1; // 1-based approximation for column index
        const totalValCol = wsColumns.length;

        // Helper to add total row
        const addTotalRow = (label, value, isFinal = false) => {
            const r = worksheet.addRow([]);
            // Merge cells for label if needed, or just place it
            r.getCell(totalLabelCol).value = label;
            r.getCell(totalValCol).value = Number(value);

            r.getCell(totalLabelCol).font = isFinal ? { bold: true, color: { argb: 'FFFFFFFF' } } : { bold: true };
            r.getCell(totalValCol).font = isFinal ? { bold: true, color: { argb: 'FFFFFFFF' } } : {};

            if (isFinal) {
                r.getCell(totalLabelCol).fill = tableHeaderFill;
                r.getCell(totalValCol).fill = tableHeaderFill;
            }
            r.getCell(totalLabelCol).alignment = { horizontal: 'right' };
        };

        addTotalRow('المجموع الفرعي:', invoice.subtotal);
        addTotalRow('الخصم الإضافي:', invoice.additional_discount);
        if (Number(invoice.vat_amount) > 0) addTotalRow('ضريبة القيمة المضافة:', invoice.vat_amount);
        addTotalRow('الإجمالي النهائي:', invoice.total_amount, true);

        // --- Write File ---
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `Invoice_${invoice.invoice_number}.xlsx`);
    };

    if (!invoice) return null;

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            {/* Toolbar */}
            <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        معاينة الفاتورة: {invoice.invoice_number}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleExportExcel} startIcon={<FileDownloadIcon />}>
                        تصدير Excel
                    </Button>
                    <Button autoFocus color="inherit" onClick={handlePrint} startIcon={<PrintIcon />} sx={{ ml: 2 }}>
                        طباعة
                    </Button>
                </Toolbar>
            </AppBar>

            <div className="invoice-preview-container">
                {/* Sidebar Controls */}
                <div className="invoice-sidebar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <SettingsIcon color="primary" />
                        <h3>إعدادات العرض</h3>
                    </div>

                    <Box sx={{ mb: 2 }}>
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

                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                            control={<Switch size="small" checked={showCompanyAddress} onChange={(e) => setShowCompanyAddress(e.target.checked)} />}
                            label="عرض عنوان الشركة"
                        />
                        <FormControlLabel
                            control={<Switch size="small" checked={showCompanyIds} onChange={(e) => setShowCompanyIds(e.target.checked)} />}
                            label="عرض السجل والضريبة"
                        />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        اختر الأعمدة التي تريد إظهارها في الطباعة:
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {columns.map(col => (
                            <FormControlLabel
                                key={col.key}
                                control={
                                    <Switch
                                        size="small"
                                        checked={col.visible}
                                        onChange={() => handleToggleColumn(col.key)}
                                    />
                                }
                                label={col.label}
                            />
                        ))}
                    </div>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="textSecondary">
                        * التغييرات تظهر فورا في المعاينة
                    </Typography>
                </div>

                {/* Main Preview */}
                <div className="invoice-main">
                    <div ref={componentRef}>
                        <InvoicePaper
                            invoice={invoice}
                            items={items}
                            columns={columns}
                            type={type}
                            company={selectedCompany}
                            showCompanyAddress={showCompanyAddress}
                            showCompanyIds={showCompanyIds}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
