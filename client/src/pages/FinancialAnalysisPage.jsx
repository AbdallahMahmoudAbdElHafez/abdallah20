import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, TextField, CircularProgress, Paper,
    Grid, Card, CardContent, Avatar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Divider, Chip, Tooltip,
    LinearProgress, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails,
    Alert, Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment, IconButton, TablePagination
} from '@mui/material';
import {
    TrendingUp as RevenueIcon,
    TrendingDown as ExpenseIcon,
    AccountBalance as BankIcon,
    Calculate as RatioIcon,
    Assessment as AssessmentIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Lightbulb as TipIcon,
    Download as DownloadIcon,
    ArrowBack as BackIcon,
    Refresh as RefreshIcon,
    HelpOutline as HelpIcon,
    Speed as SpeedIcon,
    MonetizationOn as MoneyIcon,
    Security as SecurityIcon,
    ExpandMore as ExpandMoreIcon,
    Print as PrintIcon,
    Storefront as StoreIcon,
    ReceiptLong as InvoiceIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    OpenInNew as OpenInNewIcon,
    People as PeopleIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    AccountTree as AccountTreeIcon
} from '@mui/icons-material';
import {
    ResponsiveContainer, BarChart, Bar, AreaChart, Area,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const FinancialAnalysisPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Section 3: Market & Debts Details Dialog State
    const [marketDetailsOpen, setMarketDetailsOpen] = useState(false);
    const [marketTab, setMarketTab] = useState(0);
    const [customerSearch, setCustomerSearch] = useState('');
    const [debtorPage, setDebtorPage] = useState(0);
    const [debtorRowsPerPage, setDebtorRowsPerPage] = useState(15);

    const currentYear = new Date().getFullYear();
    const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchAnalysis = async (customStart = startDate, customEnd = endDate) => {
        setLoading(true);
        try {
            const res = await reportsApi.getFinancialAnalysis({
                startDate: customStart,
                endDate: customEnd
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching financial analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    // Quick Date Presets
    const handleQuickPreset = (preset) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        let start = `${currentYear}-01-01`;
        let end = todayStr;

        if (preset === 'this_month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            start = monthStart.toISOString().split('T')[0];
        } else if (preset === 'last_3_months') {
            const qStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);
            start = qStart.toISOString().split('T')[0];
        } else if (preset === 'this_year') {
            start = `${currentYear}-01-01`;
        } else if (preset === 'all') {
            start = '2024-01-01';
        }

        setStartDate(start);
        setEndDate(end);
        fetchAnalysis(start, end);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('ar-EG', {
            style: 'currency',
            currency: 'EGP',
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    const handlePrint = () => {
        window.print();
    };

    // ==========================================
    // EXCEL STYLES & LUXURY FORMATTING HELPERS
    // ==========================================
    const EXCEL_PALETTE = {
        navyPrimary: 'FF0F172A',   // Slate 900
        navySubtitle: 'FF1E293B',  // Slate 800
        blueHeader: 'FF1D4ED8',    // Royal Blue
        slateHeader: 'FF334155',   // Slate 700
        amberHeader: 'FFD97706',   // Amber 600
        emeraldHeader: 'FF059669', // Emerald 600
        white: 'FFFFFFFF',
        rowEven: 'FFFFFFFF',
        rowOdd: 'FFF8FAFC',        // Slate 50
        rowTotal: 'FFF1F5F9',      // Slate 100
        borderThin: 'FFE2E8F0',    // Slate 200
        borderDark: 'FF0F172A',
        debtBg: 'FFFEF2F2',        // Red 50
        debtText: 'FF991B1B',      // Red 800
        successBg: 'FFECFDF5',     // Emerald 50
        successText: 'FF065F46',   // Emerald 800
        warningBg: 'FFFEF3C7',     // Amber 50
        warningText: 'FF92400E',   // Amber 800
    };

    const addSheetBanner = (sheet, title, subtitle, maxColLetter = 'E') => {
        sheet.addRow([]);
        sheet.getRow(1).height = 8;

        const titleRow = sheet.addRow([title]);
        titleRow.height = 36;
        sheet.mergeCells(`A2:${maxColLetter}2`);
        const titleCell = sheet.getCell('A2');
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.navyPrimary } };
        titleCell.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: EXCEL_PALETTE.white } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        const subRow = sheet.addRow([subtitle]);
        subRow.height = 24;
        sheet.mergeCells(`A3:${maxColLetter}3`);
        const subCell = sheet.getCell('A3');
        subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.navySubtitle } };
        subCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFDE047' } }; // Amber-300
        subCell.alignment = { vertical: 'middle', horizontal: 'center' };

        sheet.addRow([]);
        sheet.getRow(4).height = 10;
    };

    const addSectionBanner = (sheet, title, maxColLetter = 'E', bgArgb = EXCEL_PALETTE.blueHeader) => {
        const r = sheet.addRow([title]);
        r.height = 26;
        const rowNum = r.number;
        sheet.mergeCells(`A${rowNum}:${maxColLetter}${rowNum}`);
        const c = sheet.getCell(`A${rowNum}`);
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
        c.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: EXCEL_PALETTE.white } };
        c.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
        return r;
    };

    const addTableHeader = (sheet, headers, bgArgb = EXCEL_PALETTE.slateHeader) => {
        const r = sheet.addRow(headers);
        r.height = 25;
        r.eachCell({ includeEmpty: true }, (cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
            cell.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: EXCEL_PALETTE.white } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'medium', color: { argb: EXCEL_PALETTE.navyPrimary } },
                bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.navyPrimary } },
                left: { style: 'thin', color: { argb: 'FF475569' } },
                right: { style: 'thin', color: { argb: 'FF475569' } }
            };
        });
        return r;
    };

    const formatDataRow = (row, isOdd, colConfig = {}) => {
        row.height = 22;
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const config = colConfig[colNumber] || 'text';
            cell.border = {
                top: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } },
                bottom: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } },
                left: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } },
                right: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } }
            };

            if (config === 'debt') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.debtBg } };
                cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: EXCEL_PALETTE.debtText } };
                cell.numFmt = '#,##0.00';
                cell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
            } else if (config === 'currency') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isOdd ? EXCEL_PALETTE.rowOdd : EXCEL_PALETTE.rowEven } };
                cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F172A' } };
                cell.numFmt = '#,##0.00';
                cell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
            } else if (config === 'percent') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isOdd ? EXCEL_PALETTE.rowOdd : EXCEL_PALETTE.rowEven } };
                cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF1E293B' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else if (config === 'center') {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isOdd ? EXCEL_PALETTE.rowOdd : EXCEL_PALETTE.rowEven } };
                cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF334155' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isOdd ? EXCEL_PALETTE.rowOdd : EXCEL_PALETTE.rowEven } };
                cell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF1E293B' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
            }
        });
    };

    const formatTotalRow = (row, colConfig = {}) => {
        row.height = 26;
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const config = colConfig[colNumber] || 'text';
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.rowTotal } };
            cell.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: EXCEL_PALETTE.navyPrimary } };
            cell.border = {
                top: { style: 'thin', color: { argb: EXCEL_PALETTE.borderDark } },
                bottom: { style: 'double', color: { argb: EXCEL_PALETTE.borderDark } },
                left: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } },
                right: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } }
            };

            if (config === 'currency') {
                cell.numFmt = '#,##0.00';
                cell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
            } else if (config === 'percent' || config === 'center') {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.alignment = { vertical: 'middle', horizontal: 'right', indent: 1 };
            }
        });
    };

    const handleExportExcel = async () => {
        if (!data) return;

        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'نظام الإدارة المالية والتحليل الذكي';
            workbook.created = new Date();

            const today = new Date().toLocaleDateString('ar-EG');
            const periodSubtitle = `الفترة المالية: من ${data.period.startDate} إلى ${data.period.endDate} | تاريخ الاستخراج: ${today} | العملة: جنيه مصري (EGP)`;

            // ========================================================
            // SHEET 1: الملخص التنفيذي ومؤشرات الأداء
            // ========================================================
            const s1 = workbook.addWorksheet('الملخص التنفيذي ومؤشرات الأداء', {
                views: [{ rightToLeft: true }]
            });
            s1.columns = [
                { width: 36 }, // A: المؤشر المالي
                { width: 24 }, // B: القيمة المالية
                { width: 18 }, // C: النسبة المئوية
                { width: 18 }, // D: التقييم
                { width: 52 }  // E: الشرح والتفسير
            ];

            addSheetBanner(s1, 'تقرير التحليل المالي الذكي والتنفيذي', periodSubtitle, 'E');

            // Health Scorecard Banner
            const score = Number(data.healthIndex?.score || 0);
            const isGreen = score >= 80;
            const isYellow = score >= 60;
            const healthBg = isGreen ? EXCEL_PALETTE.successBg : isYellow ? EXCEL_PALETTE.warningBg : EXCEL_PALETTE.debtBg;
            const healthText = isGreen ? EXCEL_PALETTE.successText : isYellow ? EXCEL_PALETTE.warningText : EXCEL_PALETTE.debtText;

            const hRow1 = s1.addRow([`مؤشر السلامة المالية العامة للشركة: ${data.healthIndex?.status || 'مستقر'} (${score} من 100)`]);
            hRow1.height = 28;
            s1.mergeCells('A5:E5');
            const hCell1 = s1.getCell('A5');
            hCell1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: healthBg } };
            hCell1.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: healthText } };
            hCell1.alignment = { vertical: 'middle', horizontal: 'center' };
            hCell1.border = {
                top: { style: 'thin', color: { argb: healthText } },
                bottom: { style: 'thin', color: { argb: healthText } },
                left: { style: 'thin', color: { argb: healthText } },
                right: { style: 'thin', color: { argb: healthText } }
            };

            const hRow2 = s1.addRow([`التقرير الإداري الذكي: ${data.healthIndex?.summaryText || 'الوضع المالي متزن ومستقر.'}`]);
            hRow2.height = 42;
            s1.mergeCells('A6:E6');
            const hCell2 = s1.getCell('A6');
            hCell2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            hCell2.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF334155' } };
            hCell2.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
            hCell2.border = {
                bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.navyPrimary } },
                left: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } },
                right: { style: 'thin', color: { argb: EXCEL_PALETTE.borderThin } }
            };

            s1.addRow([]);
            s1.getRow(7).height = 10;

            // Section 1: Financial KPIs
            addSectionBanner(s1, 'أولاً: بطاقة الأداء المالي والربحية (Executive Financial KPIs)', 'E', EXCEL_PALETTE.blueHeader);
            addTableHeader(s1, ['المؤشر المالي', 'القيمة المالية (ج.م.)', 'النسبة المئوية', 'التقييم', 'الشرح والمدلول الإداري'], EXCEL_PALETTE.slateHeader);

            const kpiItems = [
                ['إجمالي الإيرادات والمبيعات', Number(data.incomeStatement.totalRevenue), '100.0%', 'أساس النشاط', 'إجمالي المبيعات المحققة بعد خصم المرتجعات والخصومات'],
                ['تكلفة البضاعة المباعة (المصروفات المباشرة)', Number(data.incomeStatement.directExpenses), `${data.incomeStatement.costOfGoodsSoldRatio}%`, 'تكلفة مباشرة', 'تكاليف المشتريات والتصنيع المباشرة لتوليد المبيعات'],
                ['مجمل الربح التجاري', Number(data.incomeStatement.grossProfit), `${data.incomeStatement.grossMarginPct}%`, 'ربحية تجارية', 'المتبقي من المبيعات بعد تغطية تكلفة البضاعة مباشرة'],
                ['المصروفات التشغيلية والعمومية (غير المباشرة)', Number(data.incomeStatement.indirectExpenses), `${data.incomeStatement.operatingExpenseRatio}%`, 'تكاليف تشغيل', 'مصاريف البيع والتوزيع والرواتب والمصروفات الإدارية'],
                ['صافي الربح الفعلي', Number(data.incomeStatement.netProfit), `${data.incomeStatement.netMarginPct}%`, data.incomeStatement.netProfit >= 0 ? 'ربح صافي' : 'عجز مالي', 'المكسب الصافي الحقيقي للشركة بعد تغطية كافة النفقات'],
                ['العائد على إجمالي المصروفات (ROI)', `${data.incomeStatement.roiOnExpenses}%`, `${data.incomeStatement.roiOnExpenses}%`, 'عائد استثماري', 'معدل العائد المحقق مقابل كل جنيه تم إنفاقه بالنشاط'],
                ['الكاش والسيولة بالخزن والبنوك', Number(data.balanceSheet.cashAndBanks), '-', 'نقدية جاهزة', 'سيولة نقدية فورية متاحة لتسيير العمليات وسداد الالتزامات'],
                ['مديونيات العملاء (فلوسك في السوق)', Number(data.balanceSheet.receivables), '-', 'ذمم مدينة', 'مستحقات آجلة لدى عملاء الشركة بالسوق'],
                ['التزامات الموردين والديون المتداولة', Number(data.balanceSheet.currentLiabilities), '-', 'التزامات قصيرة', 'مستحقات واجبة السداد للموردين والجهات الخارجية'],
                ['صافي رأس المال العامل', Number(data.balanceSheet.workingCapital), '-', data.balanceSheet.workingCapital >= 0 ? 'فائض تشغيلي' : 'عجز سيولة', 'الأصول المتداولة ناقص الخصوم المتداولة (مؤشر متانة الأمان)']
            ];

            kpiItems.forEach((item, idx) => {
                const row = s1.addRow(item);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'text',
                    2: typeof item[1] === 'number' ? 'currency' : 'center',
                    3: 'percent',
                    4: 'center',
                    5: 'text'
                });
            });

            s1.addRow([]);
            s1.getRow(s1.rowCount).height = 10;

            // Section 2: Financial Ratios
            addSectionBanner(s1, 'ثانياً: مؤشرات السيولة والملاءة المالية (Financial & Liquidity Ratios)', 'E', EXCEL_PALETTE.emeraldHeader);
            addTableHeader(s1, ['النسبة المالية', 'القيمة المحققة', 'المعدل المعياري المستهدف', 'التقييم المالي', 'التفسير والدلالة الإدارية'], EXCEL_PALETTE.slateHeader);

            const ratioItems = [
                ['نسبة التداول (السيولة العامة)', `${data.ratios.currentRatio}x`, '1.50x - 2.50x', data.ratios.currentRatio >= 1.5 ? 'ممتاز وآمن' : 'مقبول', 'قدرة الأصول المتداولة على تغطية الديون والالتزامات العاجلة'],
                ['نسبة السيولة السريعة', `${data.ratios.quickRatio}x`, '1.00x فما فوق', data.ratios.quickRatio >= 1.0 ? 'ممتاز' : 'مقبول', 'القدرة على الوفاء بالديون فوراً بدون اشتراط تصريف المخزون'],
                ['نسبة السيولة النقدية (الكاش الفوري)', `${data.ratios.cashRatio}x`, '0.20x فما فوق', data.ratios.cashRatio >= 0.2 ? 'ممتاز' : 'مقبول', 'نسبة تغطية الكاش الجاهز بالخزن والبنوك للديون المستحقة'],
                ['نسبة الديون إلى الأصول', `${data.ratios.debtToAssetsPct}%`, 'أقل من 50%', 'آمن ومستقر', 'مدى اعتماد الشركة على الديون والالتزامات في تمويل أصولها'],
                ['كفاءة التحصيل بالسوق', `${data.ratios.collectionEfficiencyPct}%`, '70% فما فوق', data.ratios.collectionEfficiencyPct >= 70 ? 'ممتاز' : 'يحتاج متابعة', 'نسبة المتحصلات النقدية الفعلية من إجمالي المبيعات المحققة']
            ];

            ratioItems.forEach((item, idx) => {
                const row = s1.addRow(item);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'text',
                    2: 'center',
                    3: 'center',
                    4: 'center',
                    5: 'text'
                });
            });

            s1.addRow([]);
            s1.getRow(s1.rowCount).height = 10;

            // Section 3: AI Advisor Insights
            if ((data.insights || []).length > 0) {
                addSectionBanner(s1, 'ثالثاً: توجيهات وتوصيات المستشار المالي الذكي (AI Financial Advisor Insights)', 'E', EXCEL_PALETTE.amberHeader);
                addTableHeader(s1, ['#', 'نوع الإرشاد', 'عنوان التوجيه', 'مستوى التأثير', 'تفاصيل التوجيه المالي'], EXCEL_PALETTE.slateHeader);

                data.insights.forEach((ins, idx) => {
                    const row = s1.addRow([
                        idx + 1,
                        ins.type === 'strength' ? 'نقطة قوة' : ins.type === 'opportunity' ? 'فرصة تطوير' : 'تنبيه إداري',
                        ins.title,
                        ins.impact || 'متوسط',
                        ins.message
                    ]);
                    formatDataRow(row, idx % 2 === 1, {
                        1: 'center',
                        2: 'center',
                        3: 'text',
                        4: 'center',
                        5: 'text'
                    });
                });
            }

            // ========================================================
            // SHEET 2: قائمة الدخل والتطور الشهري
            // ========================================================
            const s2 = workbook.addWorksheet('قائمة الدخل والتطور الشهري', {
                views: [{ rightToLeft: true }]
            });
            s2.columns = [
                { width: 22 }, // A: الشهر / كود
                { width: 24 }, // B: الإيرادات / اسم الحساب
                { width: 22 }, // C: التكلفة المباشرة / التصنيف
                { width: 22 }, // D: مجمل الربح / القيمة
                { width: 22 }, // E: المصروفات التشغيلية / النسبة
                { width: 22 }, // F: صافي الربح
                { width: 20 }  // G: هامش الربح %
            ];

            addSheetBanner(s2, 'قائمة الدخل الشاملة وتطور الأداء والربحية شهرياً', periodSubtitle, 'G');

            // Monthly Trend Table
            addSectionBanner(s2, 'أولاً: تطور الأداء والربحية شهرياً (Monthly Financial Trend)', 'G', EXCEL_PALETTE.blueHeader);
            addTableHeader(s2, [
                'الشهر',
                'إجمالي الإيرادات (ج.م.)',
                'تكلفة البضاعة (ج.م.)',
                'مجمل الربح (ج.م.)',
                'المصروفات التشغيلية (ج.م.)',
                'صافي الربح (ج.م.)',
                'هامش صافي الربح %'
            ], EXCEL_PALETTE.slateHeader);

            let totRev = 0;
            let totDirect = 0;
            let totGross = 0;
            let totIndirect = 0;
            let totNet = 0;

            (data.charts.monthlyTrend || []).forEach((m, idx) => {
                const rev = Number(m.revenue || 0);
                const direct = Number(m.direct_expenses || 0);
                const gross = rev - direct;
                const indirect = Number(m.indirect_expenses || 0);
                const net = Number(m.net_profit || 0);

                totRev += rev;
                totDirect += direct;
                totGross += gross;
                totIndirect += indirect;
                totNet += net;

                const row = s2.addRow([
                    m.monthLabel || m.month,
                    rev,
                    direct,
                    gross,
                    indirect,
                    net,
                    `${m.profit_margin || '0.0'}%`
                ]);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'center',
                    2: 'currency',
                    3: 'currency',
                    4: 'currency',
                    5: 'currency',
                    6: 'currency',
                    7: 'percent'
                });
            });

            // Trend Totals
            const trendTotRow = s2.addRow([
                'إجمالي الفترة بالكامل',
                totRev,
                totDirect,
                totGross,
                totIndirect,
                totNet,
                `${data.incomeStatement.netMarginPct}%`
            ]);
            formatTotalRow(trendTotRow, {
                1: 'center',
                2: 'currency',
                3: 'currency',
                4: 'currency',
                5: 'currency',
                6: 'currency',
                7: 'percent'
            });

            s2.addRow([]);
            s2.getRow(s2.rowCount).height = 12;

            // Sub-tables helper for details
            const renderDetailsSubtable = (title, items, totalVal, bannerColor, categoryLabel) => {
                addSectionBanner(s2, title, 'G', bannerColor);
                addTableHeader(s2, ['كود الحساب', 'اسم الحساب المحاسبي', 'طبيعة البند', 'القيمة المحققة (ج.م.)', 'النسبة من الإجمالي %', '', ''], EXCEL_PALETTE.slateHeader);
                s2.mergeCells(`E${s2.rowCount}:G${s2.rowCount}`);

                (items || []).forEach((item, idx) => {
                    const row = s2.addRow([
                        item.code ? `#${item.code}` : item.account_id ? `#${item.account_id}` : '-',
                        item.name || item.name_ar,
                        categoryLabel,
                        Number(item.balance || item.amount || 0),
                        `${item.percentage || '0.0'}%`,
                        '', ''
                    ]);
                    s2.mergeCells(`E${row.number}:G${row.number}`);
                    formatDataRow(row, idx % 2 === 1, {
                        1: 'center',
                        2: 'text',
                        3: 'center',
                        4: 'currency',
                        5: 'percent'
                    });
                });

                const subTot = s2.addRow([
                    'الإجمالي العام للبند',
                    '',
                    categoryLabel,
                    Number(totalVal || 0),
                    '100.0%',
                    '', ''
                ]);
                s2.mergeCells(`A${subTot.number}:B${subTot.number}`);
                s2.mergeCells(`E${subTot.number}:G${subTot.number}`);
                formatTotalRow(subTot, {
                    1: 'center',
                    3: 'center',
                    4: 'currency',
                    5: 'percent'
                });

                s2.addRow([]);
                s2.getRow(s2.rowCount).height = 10;
            };

            renderDetailsSubtable('ثانياً: تفاصيل بنود الإيرادات المحققة (Revenue Breakdown)', data.details?.revenue, data.incomeStatement.totalRevenue, EXCEL_PALETTE.blueHeader, 'إيراد نشاط');
            renderDetailsSubtable('ثالثاً: تفاصيل المصروفات المباشرة وتكلفة المبيعات (Direct Expenses / COGS)', data.details?.directExpenses, data.incomeStatement.directExpenses, EXCEL_PALETTE.amberHeader, 'تكلفة بضاعة مباشرة');
            renderDetailsSubtable('رابعاً: تفاصيل المصروفات التشغيلية والعمومية (Operating Expenses)', data.details?.indirectExpenses, data.incomeStatement.indirectExpenses, EXCEL_PALETTE.slateHeader, 'مصروف تشغيلي عام');

            // ========================================================
            // SHEET 3: المركز المالي وهيكل السيولة
            // ========================================================
            const s3 = workbook.addWorksheet('المركز المالي وهيكل السيولة', {
                views: [{ rightToLeft: true }]
            });
            s3.columns = [
                { width: 16 }, // A: كود الحساب
                { width: 34 }, // B: اسم الحساب
                { width: 24 }, // C: طبيعة البند
                { width: 24 }, // D: الرصيد
                { width: 20 }, // E: النسبة %
                { width: 36 }  // F: ملاحظات
            ];

            addSheetBanner(s3, 'قائمة المركز المالي وهيكل الأصول والخصوم المتداولة', periodSubtitle, 'F');

            // Current Assets Table
            addSectionBanner(s3, 'أولاً: تفاصيل الأصول المتداولة والسيولة (Current Assets Breakdown)', 'F', EXCEL_PALETTE.blueHeader);
            addTableHeader(s3, ['كود الحساب', 'اسم الحساب المحاسبي', 'طبيعة الأصل', 'الرصيد الدفتري (ج.م.)', 'النسبة من إجمالي الأصول %', 'المدلول المالي'], EXCEL_PALETTE.slateHeader);

            (data.details?.currentAssets || []).forEach((acc, idx) => {
                const row = s3.addRow([
                    acc.code ? `#${acc.code}` : `#${acc.account_id}`,
                    acc.name || acc.name_ar,
                    'أصل متداول',
                    Number(acc.balance || acc.amount || 0),
                    `${acc.percentage || '0.0'}%`,
                    'أصول قابلة للتحويل لنقدية سريعة'
                ]);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'center',
                    2: 'text',
                    3: 'center',
                    4: 'currency',
                    5: 'percent',
                    6: 'text'
                });
            });

            const astTot = s3.addRow([
                'إجمالي الأصول المتداولة والسيولة',
                '',
                'أصول متداولة',
                Number(data.balanceSheet.currentAssets || 0),
                '100.0%',
                'مجموع السيولة والمدينين والمخزون'
            ]);
            s3.mergeCells(`A${astTot.number}:B${astTot.number}`);
            formatTotalRow(astTot, {
                1: 'center',
                3: 'center',
                4: 'currency',
                5: 'percent',
                6: 'text'
            });

            s3.addRow([]);
            s3.getRow(s3.rowCount).height = 10;

            // Current Liabilities Table
            addSectionBanner(s3, 'ثانياً: تفاصيل الخصوم والالتزامات المتداولة (Current Liabilities Breakdown)', 'F', EXCEL_PALETTE.debtText);
            addTableHeader(s3, ['كود الحساب', 'اسم الحساب المحاسبي', 'طبيعة الالتزام', 'الرصيد المستحق (ج.م.)', 'النسبة من إجمالي الخصوم %', 'ملاحظات السداد'], EXCEL_PALETTE.slateHeader);

            (data.details?.currentLiabilities || []).forEach((acc, idx) => {
                const row = s3.addRow([
                    acc.code ? `#${acc.code}` : `#${acc.account_id}`,
                    acc.name || acc.name_ar,
                    'التزام متداول قصير الأجل',
                    Number(acc.balance || acc.amount || 0),
                    `${acc.percentage || '0.0'}%`,
                    'مستحقات واجبة السداد خلال الدورة التشغيلية'
                ]);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'center',
                    2: 'text',
                    3: 'center',
                    4: 'currency',
                    5: 'percent',
                    6: 'text'
                });
            });

            const liaTot = s3.addRow([
                'إجمالي الخصوم والالتزامات المتداولة',
                '',
                'خصوم متداولة',
                Number(data.balanceSheet.currentLiabilities || 0),
                '100.0%',
                'مجموع ديون الموردين والجهات الخارجية'
            ]);
            s3.mergeCells(`A${liaTot.number}:B${liaTot.number}`);
            formatTotalRow(liaTot, {
                1: 'center',
                3: 'center',
                4: 'currency',
                5: 'percent',
                6: 'text'
            });

            s3.addRow([]);
            s3.getRow(s3.rowCount).height = 10;

            // Working Capital Summary
            addSectionBanner(s3, 'ثالثاً: كفاءة رأس المال العامل والملاءة التشغيلية (Working Capital Assessment)', 'F', EXCEL_PALETTE.emeraldHeader);
            addTableHeader(s3, ['البند المالي', 'القيمة المالية (ج.م.)', 'المعادلة المحاسبية', 'التقييم الإداري', 'التوجيه المالي والتفسير', ''], EXCEL_PALETTE.slateHeader);
            s3.mergeCells(`E${s3.rowCount}:F${s3.rowCount}`);

            const wcItems = [
                ['إجمالي الأصول المتداولة', Number(data.balanceSheet.currentAssets), 'النقدية + المدينون + المخزون', 'قوة مالية', 'السيولة المتاحة لدعم النشاط'],
                ['إجمالي الخصوم المتداولة', Number(data.balanceSheet.currentLiabilities), 'الموردون + الدائنون + الضرائب', 'التزامات قصيرة', 'المطلوبات العاجلة الواجب الوفاء بها'],
                ['صافي رأس المال العامل', Number(data.balanceSheet.workingCapital), 'الأصول المتداولة - الخصوم المتداولة', data.balanceSheet.workingCapital >= 0 ? 'فائض أمان ممتاز' : 'عجز سيولة', 'الوسادة النقدية التي تحمي استمرارية الشركة'],
                ['مؤشر تغطية السيولة', `${(Number(data.balanceSheet.currentAssets) / (Number(data.balanceSheet.currentLiabilities) || 1)).toFixed(2)}x`, 'الأصول المتداولة ÷ الخصوم المتداولة', 'تغطية ممتازة', 'معدل تغطية الأصول السائلة لكل جنيه التزام']
            ];

            wcItems.forEach((w, idx) => {
                const row = s3.addRow([w[0], w[1], w[2], w[3], w[4], '']);
                s3.mergeCells(`E${row.number}:F${row.number}`);
                formatDataRow(row, idx % 2 === 1, {
                    1: 'text',
                    2: typeof w[1] === 'number' ? 'currency' : 'center',
                    3: 'text',
                    4: 'center',
                    5: 'text'
                });
            });

            // ========================================================
            // SHEET 4: السوق ومديونيات العملاء
            // ========================================================
            const s4 = workbook.addWorksheet('السوق ومديونيات العملاء', {
                views: [{ rightToLeft: true }]
            });
            s4.columns = [
                { width: 8 },  // A: #
                { width: 14 }, // B: كود العميل
                { width: 34 }, // C: اسم العميل
                { width: 18 }, // D: الهاتف
                { width: 22 }, // E: المدينة
                { width: 22 }, // F: إجمالي المبيعات
                { width: 22 }, // G: إجمالي التحصيلات
                { width: 26 }, // H: المديونية المتبقية
                { width: 20 }, // I: النسبة من السوق %
                { width: 18 }  // J: الحالة
            ];

            addSheetBanner(s4, 'كشف مديونيات عملاء السوق والذمم المدينة', periodSubtitle, 'J');

            // KPI Summary Row
            const kpiRow1 = s4.addRow([
                'إجمالي مديونيات السوق', '',
                'عدد العملاء المدينين', '',
                'متوسط مديونية العميل', '',
                'إجمالي الالتزامات للموردين', '',
                'صافي الفائض بالسوق', ''
            ]);
            kpiRow1.height = 22;
            s4.mergeCells('A5:B5');
            s4.mergeCells('C5:D5');
            s4.mergeCells('E5:F5');
            s4.mergeCells('G5:H5');
            s4.mergeCells('I5:J5');
            ['A5', 'C5', 'E5', 'G5', 'I5'].forEach(ref => {
                const c = s4.getCell(ref);
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.slateHeader } };
                c.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: EXCEL_PALETTE.white } };
                c.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            const kpiRow2 = s4.addRow([
                Number(data.marketAndDebts?.kpis?.totalReceivables || 0), '',
                `${data.marketAndDebts?.kpis?.customerCount || 0} عميل`, '',
                Number(data.marketAndDebts?.kpis?.averageDebtPerCustomer || 0), '',
                Number(data.marketAndDebts?.kpis?.totalLiabilities || 0), '',
                Number(data.marketAndDebts?.kpis?.netMarketPosition || 0), ''
            ]);
            kpiRow2.height = 28;
            s4.mergeCells('A6:B6');
            s4.mergeCells('C6:D6');
            s4.mergeCells('E6:F6');
            s4.mergeCells('G6:H6');
            s4.mergeCells('I6:J6');
            ['A6', 'E6', 'G6', 'I6'].forEach(ref => {
                const c = s4.getCell(ref);
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                c.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: EXCEL_PALETTE.navyPrimary } };
                c.numFmt = '#,##0.00 "ج.م."';
                c.alignment = { vertical: 'middle', horizontal: 'center' };
                c.border = { bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.amberHeader } } };
            });
            const s4C6 = s4.getCell('C6');
            s4C6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            s4C6.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: EXCEL_PALETTE.navyPrimary } };
            s4C6.alignment = { vertical: 'middle', horizontal: 'center' };
            s4C6.border = { bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.amberHeader } } };

            s4.addRow([]);
            s4.getRow(7).height = 10;

            const allDebtors = data.marketAndDebts?.allDebtors || [];
            addSectionBanner(s4, `تفاصيل مديونيات العملاء وموقف السداد الفعلي (${allDebtors.length} عميل)`, 'J', EXCEL_PALETTE.amberHeader);
            addTableHeader(s4, [
                '#',
                'كود العميل',
                'اسم العميل',
                'الهاتف',
                'المدينة / المنطقة',
                'إجمالي المبيعات (ج.م.)',
                'إجمالي التحصيلات (ج.م.)',
                'المديونية المتبقية (الرصيد) (ج.م.)',
                'النسبة من إجمالي مديونيات السوق',
                'حالة الحساب'
            ], EXCEL_PALETTE.slateHeader);

            let s4SumSales = 0;
            let s4SumPayments = 0;
            let s4SumBalance = 0;

            allDebtors.forEach((d, idx) => {
                const sales = Number(d.total_sales || 0);
                const payments = Number(d.total_payments || 0);
                const balance = Number(d.net_balance || 0);
                s4SumSales += sales;
                s4SumPayments += payments;
                s4SumBalance += balance;

                const row = s4.addRow([
                    idx + 1,
                    d.customer_id ? `#${d.customer_id}` : '-',
                    d.name,
                    d.phone || '-',
                    d.city_name || '-',
                    sales,
                    payments,
                    balance,
                    `${d.debt_percentage || '0.0'}%`,
                    balance > 0 ? 'مدين نشط' : balance < 0 ? 'رصيد دائن' : 'مسدد بالكامل'
                ]);

                formatDataRow(row, idx % 2 === 1, {
                    1: 'center',
                    2: 'center',
                    3: 'text',
                    4: 'center',
                    5: 'center',
                    6: 'currency',
                    7: 'currency',
                    8: balance > 0 ? 'debt' : 'currency',
                    9: 'percent',
                    10: 'center'
                });
            });

            // Debtors Totals Row
            const s4TotRow = s4.addRow([
                `الإجمالي العام لكافة عملاء السوق (${allDebtors.length} عميل)`,
                '', '', '', '',
                s4SumSales,
                s4SumPayments,
                s4SumBalance,
                '100.0%',
                'متوازن'
            ]);
            s4.mergeCells(`A${s4TotRow.number}:E${s4TotRow.number}`);
            formatTotalRow(s4TotRow, {
                1: 'center',
                6: 'currency',
                7: 'currency',
                8: 'currency',
                9: 'percent',
                10: 'center'
            });

            // Generate & Download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `التحليل_المالي_الشامل_${data.period.startDate}_إلى_${data.period.endDate}.xlsx`);
        } catch (err) {
            console.error('Export error:', err);
            alert('حدث خطأ أثناء تصدير ملف Excel للتحليل المالي');
        }
    };

    const exportDebtorsExcel = async () => {
        if (!data?.marketAndDebts?.allDebtors) return;
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'نظام إدارة الحسابات والتحليل المالي';
            workbook.created = new Date();

            const ws = workbook.addWorksheet('مديونيات العملاء بالسوق', {
                views: [{ rightToLeft: true }]
            });

            ws.columns = [
                { width: 8 },  // #
                { width: 14 }, // كود العميل
                { width: 34 }, // اسم العميل
                { width: 18 }, // الهاتف
                { width: 22 }, // المدينة
                { width: 22 }, // إجمالي المبيعات
                { width: 22 }, // إجمالي التحصيلات
                { width: 26 }, // المديونية المتبقية
                { width: 20 }, // نسبة المديونية %
                { width: 18 }  // الحالة
            ];

            const today = new Date().toLocaleDateString('ar-EG');
            addSheetBanner(
                ws,
                'كشف مديونيات عملاء السوق والذمم المدينة التفصيلي',
                `تاريخ الاستخراج: ${today} | إجمالي العملاء: ${(data.marketAndDebts.allDebtors || []).length} عميل | العملة: جنيه مصري (EGP)`,
                'J'
            );

            // KPI Cards row
            const kpiRow1 = ws.addRow([
                'إجمالي مديونيات السوق', '',
                'عدد العملاء المدينين', '',
                'متوسط مديونية العميل', '',
                'إجمالي الالتزامات للموردين', '',
                'صافي الفائض بالسوق', ''
            ]);
            kpiRow1.height = 22;
            ws.mergeCells('A5:B5');
            ws.mergeCells('C5:D5');
            ws.mergeCells('E5:F5');
            ws.mergeCells('G5:H5');
            ws.mergeCells('I5:J5');
            ['A5', 'C5', 'E5', 'G5', 'I5'].forEach(cellRef => {
                const c = ws.getCell(cellRef);
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_PALETTE.slateHeader } };
                c.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: EXCEL_PALETTE.white } };
                c.alignment = { vertical: 'middle', horizontal: 'center' };
            });

            const kpiRow2 = ws.addRow([
                Number(data.marketAndDebts?.kpis?.totalReceivables || 0), '',
                `${data.marketAndDebts?.kpis?.customerCount || 0} عميل`, '',
                Number(data.marketAndDebts?.kpis?.averageDebtPerCustomer || 0), '',
                Number(data.marketAndDebts?.kpis?.totalLiabilities || 0), '',
                Number(data.marketAndDebts?.kpis?.netMarketPosition || 0), ''
            ]);
            kpiRow2.height = 28;
            ws.mergeCells('A6:B6');
            ws.mergeCells('C6:D6');
            ws.mergeCells('E6:F6');
            ws.mergeCells('G6:H6');
            ws.mergeCells('I6:J6');
            ['A6', 'E6', 'G6', 'I6'].forEach(cellRef => {
                const c = ws.getCell(cellRef);
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
                c.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: EXCEL_PALETTE.navyPrimary } };
                c.numFmt = '#,##0.00 "ج.م."';
                c.alignment = { vertical: 'middle', horizontal: 'center' };
                c.border = { bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.amberHeader } } };
            });
            const c6 = ws.getCell('C6');
            c6.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
            c6.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: EXCEL_PALETTE.navyPrimary } };
            c6.alignment = { vertical: 'middle', horizontal: 'center' };
            c6.border = { bottom: { style: 'medium', color: { argb: EXCEL_PALETTE.amberHeader } } };

            ws.addRow([]);
            ws.getRow(7).height = 10;

            const allDebtors = data.marketAndDebts.allDebtors || [];
            addSectionBanner(ws, `تفاصيل مديونيات العملاء وموقف التحصيل الفعلي (${allDebtors.length} عميل)`, 'J', EXCEL_PALETTE.amberHeader);
            addTableHeader(ws, [
                '#',
                'كود العميل',
                'اسم العميل',
                'الهاتف',
                'المدينة / المنطقة',
                'إجمالي المبيعات (ج.م.)',
                'إجمالي التحصيلات (ج.م.)',
                'المديونية المتبقية (الرصيد) (ج.م.)',
                'النسبة من إجمالي مديونيات السوق',
                'حالة الحساب'
            ], EXCEL_PALETTE.slateHeader);

            let sumSales = 0;
            let sumPayments = 0;
            let sumBalance = 0;

            allDebtors.forEach((d, idx) => {
                const sales = Number(d.total_sales || 0);
                const payments = Number(d.total_payments || 0);
                const balance = Number(d.net_balance || 0);
                sumSales += sales;
                sumPayments += payments;
                sumBalance += balance;

                const row = ws.addRow([
                    idx + 1,
                    d.customer_id ? `#${d.customer_id}` : '-',
                    d.name,
                    d.phone || '-',
                    d.city_name || '-',
                    sales,
                    payments,
                    balance,
                    `${d.debt_percentage || '0.0'}%`,
                    balance > 0 ? 'مدين نشط' : balance < 0 ? 'رصيد دائن' : 'مسدد بالكامل'
                ]);

                formatDataRow(row, idx % 2 === 1, {
                    1: 'center',
                    2: 'center',
                    3: 'text',
                    4: 'center',
                    5: 'center',
                    6: 'currency',
                    7: 'currency',
                    8: balance > 0 ? 'debt' : 'currency',
                    9: 'percent',
                    10: 'center'
                });
            });

            // Totals Row
            const totRow = ws.addRow([
                `الإجمالي العام لكافة عملاء السوق (${allDebtors.length} عميل)`,
                '', '', '', '',
                sumSales,
                sumPayments,
                sumBalance,
                '100.0%',
                'متوازن'
            ]);
            ws.mergeCells(`A${totRow.number}:E${totRow.number}`);
            formatTotalRow(totRow, {
                1: 'center',
                6: 'currency',
                7: 'currency',
                8: 'currency',
                9: 'percent',
                10: 'center'
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `تقرير_مديونيات_العملاء_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (err) {
            console.error('Debtors Excel export error:', err);
            alert('حدث خطأ أثناء تصدير مديونيات العملاء');
        }
    };

    const filteredDebtors = (data?.marketAndDebts?.allDebtors || []).filter(d => {
        if (!customerSearch) return true;
        const term = customerSearch.toLowerCase().trim();
        const nameMatch = d.name && d.name.toLowerCase().includes(term);
        const phoneMatch = d.phone && d.phone.toString().includes(term);
        const cityMatch = d.city_name && d.city_name.toLowerCase().includes(term);
        return nameMatch || phoneMatch || cityMatch;
    });

    return (
        <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: '#f4f6f9', minHeight: '100vh', direction: 'rtl' }}>
            {/* Header Banner */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    mb: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #0288d1 100%)',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(13, 71, 161, 0.25)'
                }}
            >
                <Grid container alignItems="center" spacing={2} justifyContent="space-between">
                    <Grid item xs={12} md={8}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 52, height: 52, boxShadow: 2 }}>
                                <SpeedIcon sx={{ fontSize: 32, color: '#fff' }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: -0.5 }}>
                                    قسم التحليل المالي الذكي
                                </Typography>
                                <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 0.3 }}>
                                    نظرة تنفيذية شاملة ومبسطة تفهمك أرقام الشركة وسلامتها المالية بدون تعقيد محاسبي
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4} textAlign={{ xs: 'right', md: 'left' }}>
                        <Button
                            variant="contained"
                            startIcon={<BackIcon />}
                            onClick={() => navigate('/reports-dashboard')}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.18)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.28)' },
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            لوحة التقارير
                        </Button>
                    </Grid>
                </Grid>

                {/* Date Controls & Presets */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 3,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    {/* Quick Presets */}
                    <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>
                            فترات سريعة:
                        </Typography>
                        <Chip
                            label="هذا الشهر"
                            clickable
                            onClick={() => handleQuickPreset('this_month')}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                        />
                        <Chip
                            label="آخر 3 أشهر"
                            clickable
                            onClick={() => handleQuickPreset('last_3_months')}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                        />
                        <Chip
                            label={`العام الحالي (${currentYear})`}
                            clickable
                            onClick={() => handleQuickPreset('this_year')}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                        />
                        <Chip
                            label="الكل حتى اليوم"
                            clickable
                            onClick={() => handleQuickPreset('all')}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}
                        />
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 1, display: { xs: 'none', md: 'block' } }} />

                    {/* Inputs */}
                    <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                        <TextField
                            size="small"
                            type="date"
                            label="من تاريخ"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            sx={{ bgcolor: 'white', borderRadius: 1.5, minWidth: 155 }}
                        />
                        <TextField
                            size="small"
                            type="date"
                            label="إلى تاريخ"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            sx={{ bgcolor: 'white', borderRadius: 1.5, minWidth: 155 }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={() => fetchAnalysis(startDate, endDate)}
                            sx={{
                                bgcolor: '#fff',
                                color: '#0d47a1',
                                '&:hover': { bgcolor: '#f0f0f0' },
                                fontWeight: 'bold',
                                px: 3,
                                borderRadius: 1.5
                            }}
                        >
                            تحديث
                        </Button>
                        {data && (
                            <>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleExportExcel}
                                    sx={{
                                        bgcolor: '#2e7d32',
                                        '&:hover': { bgcolor: '#1b5e20' },
                                        fontWeight: 'bold',
                                        px: 2.5,
                                        borderRadius: 1.5
                                    }}
                                >
                                    تصدير Excel
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<PrintIcon />}
                                    onClick={handlePrint}
                                    sx={{
                                        borderColor: 'rgba(255,255,255,0.6)',
                                        color: '#fff',
                                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
                                        fontWeight: 'bold',
                                        borderRadius: 1.5
                                    }}
                                >
                                    طباعة
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>

            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" py={12}>
                    <CircularProgress size={64} thickness={4} />
                    <Typography mt={3} variant="h6" color="text.secondary">
                        جاري معالجة القيود وحساب المؤشرات المالية والتشخيص الذكي...
                    </Typography>
                </Box>
            ) : data ? (
                <>
                    {/* SECTION 1: Health Index & Executive Plain-Arabic Digest */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2.5, md: 3.5 },
                            mb: 4,
                            borderRadius: 3.5,
                            border: '1px solid #e0e0e0',
                            bgcolor: '#fff',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                        }}
                    >
                        <Grid container spacing={3} alignItems="center">
                            {/* Score Dial / Badge */}
                            <Grid item xs={12} md={3.5} textAlign="center">
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        bgcolor: data.healthIndex.bgColor,
                                        border: `2px solid ${data.healthIndex.color}`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                                        مؤشر السلامة والأداء المالي
                                    </Typography>
                                    <Box position="relative" display="inline-flex" my={1.5}>
                                        <Typography variant="h2" fontWeight="900" sx={{ color: data.healthIndex.color }}>
                                            {data.healthIndex.score}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: data.healthIndex.color, alignSelf: 'flex-start', mt: 1, ml: 0.5 }}>
                                            / 100
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={data.healthIndex.status}
                                        sx={{
                                            bgcolor: data.healthIndex.color,
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            px: 1.5,
                                            py: 0.5
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ mt: 1, color: data.healthIndex.color, fontWeight: 'bold' }}>
                                        {data.healthIndex.badge}
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* Plain Arabic Speech-Digest for Non-Accountants */}
                            <Grid item xs={12} md={8.5}>
                                <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #edf2f7' }}>
                                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <TipIcon color="primary" sx={{ fontSize: 28 }} />
                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                            الملخص التنفيذي باللغة البسيطة (لأي شخص):
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155' }}>
                                        {data.healthIndex.summaryText}
                                    </Typography>

                                    {/* 4 Quick Reality Checkpoints */}
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6} sm={3}>
                                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">الربحية</Typography>
                                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                                    {data.incomeStatement.netMarginPct}% صافي
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">تغطية الديون</Typography>
                                                <Typography variant="body1" fontWeight="bold" color="primary.main">
                                                    {data.ratios.currentRatio} مرة
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">كاش جاهز</Typography>
                                                <Typography variant="body1" fontWeight="bold" color="success.dark">
                                                    {formatCurrency(data.balanceSheet.cashAndBanks)}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">رأس مال عامل</Typography>
                                                <Typography variant="body1" fontWeight="bold" color="info.main">
                                                    {formatCurrency(data.balanceSheet.workingCapital)}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* SECTION 2: The 4 Big Pillars (Main Financial Cards) */}
                    <Grid container spacing={3} mb={4}>
                        {/* 1. Revenue */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                            إجمالي الإيرادات والمبيعات
                                        </Typography>
                                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 44, height: 44 }}>
                                            <RevenueIcon />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="#1976d2">
                                        {formatCurrency(data.incomeStatement.totalRevenue)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        {data.operations.invoicesCount > 0 ? (
                                            `إجمالي ${data.operations.invoicesCount} فاتورة (متوسط ${formatCurrency(data.operations.avgInvoiceAmount)})`
                                        ) : 'مجموع إيرادات المبيعات المحققة'}
                                    </Typography>
                                    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0f9ff', borderRadius: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HelpIcon sx={{ fontSize: 14 }} />
                                            ماذا يعني؟ إجمالي قيمة البضاعة والخدمات المباعة للعملاء
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 2. Gross Profit */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                            مجمل الربح (قبل المصاريف)
                                        </Typography>
                                        <Avatar sx={{ bgcolor: '#e0f2f1', color: '#00897b', width: 44, height: 44 }}>
                                            <RatioIcon />
                                        </Avatar>
                                    </Box>
                                    <Box display="flex" alignItems="baseline" gap={1}>
                                        <Typography variant="h4" fontWeight="bold" color="#00897b">
                                            {formatCurrency(data.incomeStatement.grossProfit)}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={`هامش مجمل الربح: ${data.incomeStatement.grossMarginPct}%`}
                                        size="small"
                                        sx={{ mt: 1, bgcolor: '#e0f2f1', color: '#00796b', fontWeight: 'bold' }}
                                    />
                                    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0fdfa', borderRadius: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: '#0f766e', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HelpIcon sx={{ fontSize: 14 }} />
                                            ماذا يعني؟ الربح المتبقي بعد سداد تكلفة شراء البضاعة وتصنيعها
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 3. Net Profit */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', height: '100%', bgcolor: data.incomeStatement.netProfit >= 0 ? '#f0fdf4' : '#fef2f2' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                            صافي الربح الفعلي
                                        </Typography>
                                        <Avatar sx={{ bgcolor: data.incomeStatement.netProfit >= 0 ? '#dcfce7' : '#fee2e2', color: data.incomeStatement.netProfit >= 0 ? '#16a34a' : '#dc2626', width: 44, height: 44 }}>
                                            <MoneyIcon />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color={data.incomeStatement.netProfit >= 0 ? '#15803d' : '#b91c1c'}>
                                        {formatCurrency(data.incomeStatement.netProfit)}
                                    </Typography>
                                    <Chip
                                        label={`هامش الربح الصافي: ${data.incomeStatement.netMarginPct}%`}
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            bgcolor: data.incomeStatement.netProfit >= 0 ? '#bbf7d0' : '#fecaca',
                                            color: data.incomeStatement.netProfit >= 0 ? '#14532d' : '#7f1d1d',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#ffffff', borderRadius: 1.5, border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <Typography variant="caption" sx={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HelpIcon sx={{ fontSize: 14 }} />
                                            ماذا يعني؟ المكسب الحقيقي بعد دفع كافة المصاريف والرواتب والإيجار
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* 4. Instant Cash */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: 3.5, border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', height: '100%' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                            السيولة النقدية الجاهزة (كاش)
                                        </Typography>
                                        <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 44, height: 44 }}>
                                            <BankIcon />
                                        </Avatar>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                                        {formatCurrency(data.balanceSheet.cashAndBanks)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        بالخزائن والحسابات البنكية المتاحة فوراً
                                    </Typography>
                                    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0fdf4', borderRadius: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <HelpIcon sx={{ fontSize: 14 }} />
                                            ماذا يعني؟ كاش فوري في البنك والخزينة يمكنك استخدامه الآن
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* SECTION 3: Visual Analytics & Charts */}
                    <Grid container spacing={3} mb={4}>
                        {/* Monthly Trend Area/Bar Chart */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, borderRadius: 3.5, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">
                                            التطور المالي الشهري (الإيرادات مقابل المصروفات والأرباح)
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            رصد اتجاه حركة النشاط وصافي الربح شهر بشهر
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ width: '100%', height: 320 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={data.charts.monthlyTrend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                                            <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                                            <RechartsTooltip formatter={(val) => formatCurrency(val)} />
                                            <Legend wrapperStyle={{ paddingTop: 10 }} />
                                            <Bar dataKey="revenue" name="الإيرادات" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="total_expenses" name="إجمالي المصروفات والتكاليف" fill="#ef5350" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="net_profit" name="صافي الربح" fill="#4caf50" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Pound Breakdown PieChart */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3.5, border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    أين يذهب كل 100 جنيه من مبيعاتك؟
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                    تشريح وتوزيع كل جنيه إيراد
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={data.charts.poundBreakdown}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={4}
                                            >
                                                {data.charts.poundBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(val) => formatCurrency(val)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    {data.charts.poundBreakdown.map((item, idx) => (
                                        <Box key={idx} display="flex" justifyContent="space-between" alignItems="center" my={0.8}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                                                <Typography variant="body2">{item.name}</Typography>
                                            </Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {item.percentage}% ({formatCurrency(item.value)})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* SECTION 4: Smart Financial Ratios Explained Simply */}
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RatioIcon color="primary" />
                            المؤشرات والنسب المالية مشروحة ببساطة:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            توضح لك ما إذا كانت أرقامك آمنة مقارنة بالمعايير العالمية دون الحاجة لحسابات معقدة
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Card 1: Liquidity */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SecurityIcon fontSize="small" />
                                        1. السيولة والأمان المالي
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Current Ratio */}
                                    <Box mb={2.5}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight="bold">نسبة التداول (السيولة الحالية):</Typography>
                                            <Chip label={`${data.ratios.currentRatio}x`} size="small" color={data.ratios.currentRatio >= 1.5 ? 'success' : 'warning'} />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(100, (data.ratios.currentRatio / 3) * 100)}
                                            sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: data.ratios.currentRatio >= 1.5 ? '#2e7d32' : '#ed6c02' } }}
                                        />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            {data.ratios.currentRatio >= 1.5
                                                ? `ممتاز: لكل جنيه دين تمتلك الشركة ${data.ratios.currentRatio} جنيه لتسديده بأريحية.`
                                                : `انتبه: السيولة قريبة من حد الالتزامات ويُفضل تعزيز النقدية.`
                                            }
                                        </Typography>
                                    </Box>

                                    {/* Quick Ratio */}
                                    <Box mb={2.5}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight="bold">السيولة السريعة (بدون بضاعة):</Typography>
                                            <Chip label={`${data.ratios.quickRatio}x`} size="small" color={data.ratios.quickRatio >= 1.0 ? 'success' : 'warning'} />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            لو لم تبع أي بضاعة من المخزن، نقدية البنك + ديون العملاء تكفي لسداد الديون {data.ratios.quickRatio} مرة.
                                        </Typography>
                                    </Box>

                                    {/* Working Capital */}
                                    <Box sx={{ p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #dcfce7' }}>
                                        <Typography variant="caption" color="text.secondary">فائض رأس المال العامل:</Typography>
                                        <Typography variant="h6" fontWeight="bold" color="success.main">
                                            {formatCurrency(data.balanceSheet.workingCapital)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            الأموال الفائضة لتشغيل النشاط وتغطية المصاريف اليومية
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Card 2: Profitability */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <RevenueIcon fontSize="small" />
                                        2. نسب الربحية وكفاءة المصروفات
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Gross Margin */}
                                    <Box mb={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight="bold">هامش مجمل الربح:</Typography>
                                            <Typography variant="body1" fontWeight="bold" color="primary.main">{data.incomeStatement.grossMarginPct}%</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            من كل 100 جنيه مبيعات، يتبقى {data.incomeStatement.grossMarginPct} جنيه بعد تكلفة شراء وتصنيع البضاعة.
                                        </Typography>
                                    </Box>

                                    {/* Net Margin */}
                                    <Box mb={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight="bold">هامش صافي الربح:</Typography>
                                            <Typography variant="body1" fontWeight="bold" color="success.main">{data.incomeStatement.netMarginPct}%</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            من كل 100 جنيه مبيعات، يدخل جيب الشركة {data.incomeStatement.netMarginPct} جنيه كأرباح صافية.
                                        </Typography>
                                    </Box>

                                    {/* OpEx Ratio */}
                                    <Box mb={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                            <Typography variant="body2" fontWeight="bold">نسبة المصروفات التشغيلية:</Typography>
                                            <Typography variant="body1" fontWeight="bold" color="warning.main">{data.incomeStatement.operatingExpenseRatio}%</Typography>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            المصاريف الإدارية والتسويقية تلتهم {data.incomeStatement.operatingExpenseRatio}% من مبيعاتك.
                                        </Typography>
                                    </Box>

                                    {/* ROI */}
                                    <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #dbeafe' }}>
                                        <Typography variant="caption" color="text.secondary">العائد على المصروفات (ROI):</Typography>
                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                            +{data.incomeStatement.roiOnExpenses}%
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            كل 100 جنيه مصروفات مباشرة وتشغيلية تولد أرباحاً إضافية قدرها {data.incomeStatement.roiOnExpenses} جنيه.
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Card 3: Market & Receivables */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StoreIcon fontSize="small" />
                                            3. السوق والذمم (فلوسك وما عليك)
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={`${data.marketAndDebts?.totalCustomersWithDebt || 0} عميل مدين`}
                                            color="warning"
                                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', height: 24 }}
                                        />
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />

                                    <Box mb={2}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="body2" color="text.secondary">فلوسك بالسوق (مديونيات العملاء):</Typography>
                                            {data.marketAndDebts?.avgDebtPerCustomer > 0 && (
                                                <Typography variant="caption" color="text.secondary">
                                                    متوسط: {formatCurrency(data.marketAndDebts.avgDebtPerCustomer)}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                            {formatCurrency(data.marketAndDebts?.totalReceivables ?? data.balanceSheet.receivables)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            تمثل {data.balanceSheet.currentAssets > 0 ? Math.round(((data.marketAndDebts?.totalReceivables ?? data.balanceSheet.receivables) / data.balanceSheet.currentAssets) * 100) : 0}% من إجمالي أصولك المتداولة.
                                        </Typography>
                                    </Box>

                                    {/* Top 3 Debtors preview */}
                                    {data.marketAndDebts?.topDebtors && data.marketAndDebts.topDebtors.length > 0 && (
                                        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#fffbeb', borderRadius: 2, border: '1px dashed #fde68a' }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.8}>
                                                <Typography variant="caption" fontWeight="bold" color="#92400e">
                                                    أكبر المدينين بالسوق:
                                                </Typography>
                                                <Typography variant="caption" color="#b45309" sx={{ fontSize: '0.7rem' }}>
                                                    أعلى 3 من أصل {data.marketAndDebts.totalCustomersWithDebt}
                                                </Typography>
                                            </Box>
                                            {data.marketAndDebts.topDebtors.slice(0, 3).map((deb, dIdx) => (
                                                <Box key={deb.id || dIdx} display="flex" justifyContent="space-between" alignItems="center" py={0.3}>
                                                    <Typography variant="caption" noWrap sx={{ maxWidth: '65%', fontWeight: 600, color: '#1e293b' }}>
                                                        {dIdx + 1}. {deb.name}
                                                    </Typography>
                                                    <Typography variant="caption" fontWeight="bold" color="error.main">
                                                        {formatCurrency(deb.net_balance)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}

                                    <Box mb={2}>
                                        <Typography variant="body2" color="text.secondary">فلوس عليك للموردين والجهات:</Typography>
                                        <Typography variant="h6" fontWeight="bold" color="error.main">
                                            {formatCurrency(data.marketAndDebts?.totalLiabilities ?? data.balanceSheet.currentLiabilities)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ديون والتزامات قريبة السداد للموردين والضرائب ({data.marketAndDebts?.liabilityAccounts?.length || 0} بنود).
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">صافي المركز المالي للذمم (الفرق لصالحك):</Typography>
                                        <Typography variant="h6" fontWeight="bold" color="success.main">
                                            +{formatCurrency(data.marketAndDebts?.netMarketBalance ?? (data.balanceSheet.receivables - data.balanceSheet.currentLiabilities))}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            أموالك عند العملاء تغطي كامل ديونك وتفيض بهذا المبلغ
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 'auto', pt: 1 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            size="medium"
                                            onClick={() => setMarketDetailsOpen(true)}
                                            startIcon={<VisibilityIcon />}
                                            sx={{
                                                bgcolor: '#f59e0b',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                borderRadius: 2.5,
                                                py: 1,
                                                fontSize: '0.88rem',
                                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                                                '&:hover': { bgcolor: '#d97706' }
                                            }}
                                        >
                                            الاطلاع على تفاصيل السوق والعملاء والحسابات
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* SECTION 5: Smart AI Advisor & Actionable Insights */}
                    <Box mb={4}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TipIcon color="warning" />
                            التشخيص والتوصيات الذكية لتحسين الأداء:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            ملاحظات واقتراحات عملية مستخلصة آلياً من الأرقام لمساعدتك في اتخاذ القرار الصحيح
                        </Typography>

                        <Grid container spacing={2}>
                            {data.insights.map((item, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                            border: '1px solid',
                                            borderColor: item.type === 'positive' ? '#bbf7d0' : item.type === 'warning' ? '#fecaca' : '#fed7aa',
                                            bgcolor: item.type === 'positive' ? '#f0fdf4' : item.type === 'warning' ? '#fef2f2' : '#fffbeb',
                                            display: 'flex',
                                            gap: 2,
                                            alignItems: 'flex-start'
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: item.type === 'positive' ? '#22c55e' : item.type === 'warning' ? '#ef4444' : '#f97316',
                                                color: '#fff',
                                                width: 40,
                                                height: 40
                                            }}
                                        >
                                            {item.type === 'positive' ? <CheckIcon /> : item.type === 'warning' ? <WarningIcon /> : <TipIcon />}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">
                                                {item.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5, color: '#475569', lineHeight: 1.6 }}>
                                                {item.description}
                                            </Typography>
                                            <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1.5 }}>
                                                <Typography variant="caption" fontWeight="bold" color="text.secondary">
                                                    💡 التفسير البسيط: {item.simpleExplanation}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* SECTION 6: Detailed Account Drill-Down (Accordion) */}
                    <Accordion sx={{ borderRadius: 3, '&:before': { display: 'none' }, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                📋 استعراض الجداول التفصيلية لبنود الحسابات (إيرادات، مصروفات، أصول، خصوم)
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3 }}>
                            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 3 }}>
                                <Tab label="تفاصيل الإيرادات" />
                                <Tab label="المصروفات المباشرة" />
                                <Tab label="المصروفات التشغيلية" />
                                <Tab label="الأصول المتداولة" />
                                <Tab label="الخصوم والالتزامات" />
                            </Tabs>

                            {/* Tab 0: Revenues */}
                            {activeTab === 0 && (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>بند الإيراد</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من الإجمالي</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.revenue.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                        {formatCurrency(r.amount)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {data.incomeStatement.totalRevenue > 0 ? `${((r.amount / data.incomeStatement.totalRevenue) * 100).toFixed(1)}%` : '0%'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>الإجمالي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
                                                    {formatCurrency(data.incomeStatement.totalRevenue)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Tab 1: Direct Expenses */}
                            {activeTab === 1 && (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>البند المباشر</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من المباشر</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.directExpenses.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                        {formatCurrency(r.amount)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {data.incomeStatement.directExpenses > 0 ? `${((r.amount / data.incomeStatement.directExpenses) * 100).toFixed(1)}%` : '0%'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>إجمالي التكلفة المباشرة</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                    {formatCurrency(data.incomeStatement.directExpenses)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Tab 2: Indirect Expenses */}
                            {activeTab === 2 && (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>بند المصروف التشغيلي</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>المبلغ</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من الإجمالي</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.indirectExpenses.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'warning.dark', fontWeight: 'bold' }}>
                                                        {formatCurrency(r.amount)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {data.incomeStatement.indirectExpenses > 0 ? `${((r.amount / data.incomeStatement.indirectExpenses) * 100).toFixed(1)}%` : '0%'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                                <TableCell sx={{ fontWeight: 'bold' }}>إجمالي المصروفات غير المباشرة</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                                                    {formatCurrency(data.incomeStatement.indirectExpenses)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Tab 3: Current Assets */}
                            {activeTab === 3 && (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>بند الأصل المتداول</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد القائم</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من الأصول المتداولة</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.currentAssets.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                        {formatCurrency(r.amount)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {data.balanceSheet.currentAssets > 0 ? `${((r.amount / data.balanceSheet.currentAssets) * 100).toFixed(1)}%` : '0%'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Tab 4: Current Liabilities */}
                            {activeTab === 4 && (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>بند الالتزام / الخصم</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد القائم</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من الالتزامات</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.details.currentLiabilities.map(r => (
                                                <TableRow key={r.id}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                                                        {formatCurrency(r.amount)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {data.balanceSheet.currentLiabilities > 0 ? `${((r.amount / data.balanceSheet.currentLiabilities) * 100).toFixed(1)}%` : '0%'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </>
            ) : (
                <Alert severity="info">لم يتم العثور على بيانات في هذه الفترة.</Alert>
            )}

            {/* Modal / Dialog: Comprehensive Market & Debts Breakdown */}
            {data && (
                <Dialog
                    open={marketDetailsOpen}
                    onClose={() => setMarketDetailsOpen(false)}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 3.5,
                            direction: 'rtl',
                            minHeight: '80vh',
                            maxHeight: '92vh'
                        }
                    }}
                >
                    <DialogTitle sx={{ p: 2.5, bgcolor: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap={1.5}>
                                <Avatar sx={{ bgcolor: '#fef3c7', color: '#d97706', width: 44, height: 44 }}>
                                    <StoreIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                        تفاصيل السوق والذمم (فلوسك وما عليك)
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        بيان تفصيلي بمديونيات جميع العملاء ومستحقات الموردين والجهات وحسابات الأستاذ المرتبطة
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton onClick={() => setMarketDetailsOpen(false)} sx={{ color: 'text.secondary' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ p: 3, bgcolor: '#f8fafc' }}>
                        {/* Top KPI Cards in Dialog */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                    <Typography variant="caption" color="#1e40af" fontWeight="bold">
                                        فلوسك في السوق (مديونيات العملاء):
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="#1e3a8a" mt={0.5}>
                                        {formatCurrency(data.marketAndDebts?.totalReceivables ?? data.balanceSheet.receivables)}
                                    </Typography>
                                    <Typography variant="caption" color="#3b82f6" display="block" mt={0.5}>
                                        لدى {data.marketAndDebts?.totalCustomersWithDebt || 0} عميل • متوسط {formatCurrency(data.marketAndDebts?.avgDebtPerCustomer || 0)}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                                    <Typography variant="caption" color="#991b1b" fontWeight="bold">
                                        فلوس عليك (الموردين والالتزامات):
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="#7f1d1d" mt={0.5}>
                                        {formatCurrency(data.marketAndDebts?.totalLiabilities ?? data.balanceSheet.currentLiabilities)}
                                    </Typography>
                                    <Typography variant="caption" color="#ef4444" display="block" mt={0.5}>
                                        تشمل {data.marketAndDebts?.liabilityAccounts?.length || 0} بنود التزامات وموردين وضرائب
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Paper sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <Typography variant="caption" color="#166534" fontWeight="bold">
                                        صافي رصيد السوق (الفرق لصالحك):
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color="#14532d" mt={0.5}>
                                        +{formatCurrency(data.marketAndDebts?.netMarketBalance ?? (data.balanceSheet.receivables - data.balanceSheet.currentLiabilities))}
                                    </Typography>
                                    <Typography variant="caption" color="#22c55e" display="block" mt={0.5}>
                                        أموالك بالسوق تغطي ديونك بالكامل وتفيض
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Navigation Tabs */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs
                                value={marketTab}
                                onChange={(e, v) => setMarketTab(v)}
                                textColor="primary"
                                indicatorColor="primary"
                            >
                                <Tab
                                    icon={<PeopleIcon fontSize="small" />}
                                    iconPosition="start"
                                    label={`مديونيات العملاء بالسوق (${data.marketAndDebts?.allDebtors?.length || 0})`}
                                    sx={{ fontWeight: 'bold' }}
                                />
                                <Tab
                                    icon={<ExpenseIcon fontSize="small" />}
                                    iconPosition="start"
                                    label={`المستحقات والالتزامات عليك (${data.marketAndDebts?.liabilityAccounts?.length || 0})`}
                                    sx={{ fontWeight: 'bold' }}
                                />
                                <Tab
                                    icon={<AccountTreeIcon fontSize="small" />}
                                    iconPosition="start"
                                    label="شجرة الحسابات المحاسبية المرتبطة"
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Tabs>
                        </Box>

                        {/* TAB 0: ALL DEBTORS LIST */}
                        {marketTab === 0 && (
                            <Box>
                                <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
                                    <TextField
                                        size="small"
                                        placeholder="ابحث باسم العميل، رقم الهاتف، أو المدينة..."
                                        value={customerSearch}
                                        onChange={(e) => {
                                            setCustomerSearch(e.target.value);
                                            setDebtorPage(0);
                                        }}
                                        sx={{ minWidth: 320, flexGrow: 1, bgcolor: '#fff', borderRadius: 2 }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: customerSearch ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => { setCustomerSearch(''); setDebtorPage(0); }}>
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null
                                        }}
                                    />
                                    <Box display="flex" gap={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate('/reports/customer-receivables')}
                                            startIcon={<OpenInNewIcon />}
                                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                        >
                                            تقرير أعمار الديون الكامل
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            onClick={exportDebtorsExcel}
                                            startIcon={<DownloadIcon />}
                                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                        >
                                            تصدير العملاء إكسيل
                                        </Button>
                                    </Box>
                                </Box>

                                {filteredDebtors.length === 0 ? (
                                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                                        لا يوجد عملاء يطابقون بحثك "{customerSearch}".
                                    </Alert>
                                ) : (
                                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', width: 50 }}>#</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>اسم العميل وبيانات الاتصال</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>المدينة / المنطقة</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>إجمالي المبيعات</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>إجمالي التحصيلات</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>المديونية المتبقية (الرصيد)</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من السوق</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>كشف الحساب</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredDebtors
                                                    .slice(debtorPage * debtorRowsPerPage, debtorPage * debtorRowsPerPage + debtorRowsPerPage)
                                                    .map((deb, dIdx) => {
                                                        const globalIndex = debtorPage * debtorRowsPerPage + dIdx + 1;
                                                        const pctOfTotal = data.marketAndDebts?.totalReceivables > 0
                                                            ? ((deb.net_balance / data.marketAndDebts.totalReceivables) * 100).toFixed(1)
                                                            : 0;

                                                        return (
                                                            <TableRow key={deb.id || dIdx} hover>
                                                                <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                                    {globalIndex}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Typography variant="body2" fontWeight="bold" color="#0f172a">
                                                                        {deb.name}
                                                                    </Typography>
                                                                    {deb.phone && (
                                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                            <PhoneIcon sx={{ fontSize: 13 }} />
                                                                            {deb.phone}
                                                                        </Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {deb.city_name ? (
                                                                        <Chip size="small" label={deb.city_name} variant="outlined" sx={{ height: 22, fontSize: '0.72rem' }} />
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">-</Typography>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {formatCurrency(deb.total_sales || 0)}
                                                                </TableCell>
                                                                <TableCell align="right" sx={{ color: 'success.main' }}>
                                                                    {formatCurrency(deb.total_payments || 0)}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Typography variant="body2" fontWeight="bold" color="error.main">
                                                                        {formatCurrency(deb.net_balance)}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <Chip
                                                                        size="small"
                                                                        label={`${pctOfTotal}%`}
                                                                        sx={{
                                                                            height: 22,
                                                                            fontSize: '0.72rem',
                                                                            bgcolor: Number(pctOfTotal) >= 5 ? '#fee2e2' : '#f1f5f9',
                                                                            color: Number(pctOfTotal) >= 5 ? '#b91c1c' : '#475569',
                                                                            fontWeight: 'bold'
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Box display="flex" justifyContent="center" gap={0.5}>
                                                                        <Tooltip title="فتح كشف حساب تفصيلي في صفحة جديدة">
                                                                            <Button
                                                                                size="small"
                                                                                variant="outlined"
                                                                                color="primary"
                                                                                onClick={() => window.open(`/customers/${deb.id}/statement-detailed`, '_blank')}
                                                                                startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                                                                sx={{ fontSize: '0.72rem', py: 0.2, px: 1, borderRadius: 1.5 }}
                                                                            >
                                                                                تفصيلي
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <Tooltip title="فتح كشف حساب عام في صفحة جديدة">
                                                                            <Button
                                                                                size="small"
                                                                                variant="text"
                                                                                onClick={() => window.open(`/customers/${deb.id}/statement`, '_blank')}
                                                                                sx={{ fontSize: '0.72rem', py: 0.2, px: 0.8, color: 'text.secondary' }}
                                                                            >
                                                                                عادي
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            component="div"
                                            count={filteredDebtors.length}
                                            page={debtorPage}
                                            onPageChange={(e, newPage) => setDebtorPage(newPage)}
                                            rowsPerPage={debtorRowsPerPage}
                                            onRowsPerPageChange={(e) => {
                                                setDebtorRowsPerPage(parseInt(e.target.value, 10));
                                                setDebtorPage(0);
                                            }}
                                            rowsPerPageOptions={[10, 15, 25, 50, 100]}
                                            labelRowsPerPage="عدد الصفوف بالصفحة:"
                                            labelDisplayedRows={({ from, to, count }) => `${from} - ${to} من أصل ${count}`}
                                        />
                                    </TableContainer>
                                )}
                            </Box>
                        )}

                        {/* TAB 1: LIABILITIES / PAYABLES */}
                        {marketTab === 1 && (
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                                    الديون والالتزامات المالية قصيرة الأجل المستحقة على الشركة للموردين والجهات الدائنة ومصلحة الضرائب:
                                </Typography>
                                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2.5, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>رقم الحساب</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>اسم الحساب / الجهة الدائنة</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد المستحق (عليك)</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>النسبة من إجمالي الالتزامات</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>دفتر الأستاذ / كشف الحساب</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(data.marketAndDebts?.liabilityAccounts || []).map((acc) => {
                                                const totalLiab = data.marketAndDebts?.totalLiabilities || 1;
                                                const bal = acc.amount ?? acc.balance ?? 0;
                                                const pct = ((Math.abs(bal) / totalLiab) * 100).toFixed(1);

                                                return (
                                                    <TableRow key={acc.id} hover>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'primary.main' }}>
                                                            #{acc.id}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>
                                                            {acc.name || acc.name_ar}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                            {formatCurrency(bal)}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Chip
                                                                size="small"
                                                                label={`${pct}%`}
                                                                sx={{ height: 22, fontSize: '0.72rem', fontWeight: 'bold' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                                                                onClick={() => window.open(`/reports/general-ledger?accountId=${acc.id}`, '_blank')}
                                                                sx={{ fontSize: '0.72rem', borderRadius: 1.5, py: 0.2 }}
                                                            >
                                                                عرض الحركات بدفتر الأستاذ
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}

                        {/* TAB 2: CHART OF ACCOUNTS TREE MAPPING */}
                        {marketTab === 2 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #bfdbfe', bgcolor: '#fff' }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                            <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af', width: 32, height: 32 }}>
                                                <StoreIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight="bold" color="#1e3a8a">
                                                حسابات المدينين والأصول المتداولة
                                            </Typography>
                                        </Box>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>رقم</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>اسم الحساب</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>عرض</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(data.marketAndDebts?.receivableAccounts || []).map(acc => (
                                                        <TableRow key={acc.id} hover>
                                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{acc.id}</TableCell>
                                                            <TableCell>{acc.name || acc.name_ar}</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                                                {formatCurrency(acc.amount ?? acc.balance ?? 0)}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => window.open(`/reports/general-ledger?accountId=${acc.id}`, '_blank')}
                                                                >
                                                                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, borderRadius: 2.5, border: '1px solid #fecaca', bgcolor: '#fff' }}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                                            <Avatar sx={{ bgcolor: '#fee2e2', color: '#991b1b', width: 32, height: 32 }}>
                                                <ExpenseIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Typography variant="subtitle1" fontWeight="bold" color="#7f1d1d">
                                                حسابات الدائنين والخصوم المتداولة
                                            </Typography>
                                        </Box>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>رقم</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>اسم الحساب</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>الرصيد</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>عرض</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(data.marketAndDebts?.liabilityAccounts || []).map(acc => (
                                                        <TableRow key={acc.id} hover>
                                                            <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>#{acc.id}</TableCell>
                                                            <TableCell>{acc.name || acc.name_ar}</TableCell>
                                                            <TableCell align="right" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                                                                {formatCurrency(acc.amount ?? acc.balance ?? 0)}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => window.open(`/reports/general-ledger?accountId=${acc.id}`, '_blank')}
                                                                >
                                                                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid #e2e8f0', justifyContent: 'space-between' }}>
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={exportDebtorsExcel}
                            startIcon={<DownloadIcon />}
                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                        >
                            تصدير كشف المديونيات إلى ملف إكسيل (Excel)
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setMarketDetailsOpen(false)}
                            sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
                        >
                            إغلاق النافذة
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default FinancialAnalysisPage;
