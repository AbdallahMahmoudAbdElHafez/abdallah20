import ExcelJS from 'exceljs';

/**
 * Export Sales Report to Excel
 */
const exportSalesReport = async (salesData, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير المبيعات');

    // Set RTL
    worksheet.views = [{ rightToLeft: true }];

    // Add title
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير المبيعات التفصيلي';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Add summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الفواتير:', summary.total_invoices]);
    worksheet.addRow(['إجمالي المبيعات:', summary.total_sales]);
    worksheet.addRow(['إجمالي الضرائب:', summary.total_tax]);
    worksheet.addRow(['إجمالي الخصومات:', summary.total_discount]);
    worksheet.addRow([]);

    // Add headers
    const headers = ['رقم الفاتورة', 'التاريخ', 'العميل', 'مندوب المبيعات', 'مندوب التوزيع', 'الإجمالي', 'الضريبة', 'الخصم', 'الصافي'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE3F2FD' }
    };

    // Add data
    salesData.forEach(sale => {
        const total = parseFloat(sale.total_amount || 0);
        const tax = parseFloat(sale.tax_amount || 0) + parseFloat(sale.vat_amount || 0);
        const discount = parseFloat(sale.additional_discount || 0);
        const net = total - discount;

        worksheet.addRow([
            sale.invoice_number || '',
            sale.invoice_date || '',
            sale.party?.name || '',
            sale.employee?.name || '',
            sale.distributor_employee?.name || '',
            total,
            tax,
            discount,
            net
        ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
        column.width = 15;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Purchases Report to Excel
 */
const exportPurchasesReport = async (purchasesData, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير المشتريات');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير المشتريات التفصيلي';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الفواتير:', summary.total_invoices]);
    worksheet.addRow(['إجمالي المشتريات:', summary.total_amount]);
    worksheet.addRow(['إجمالي الضرائب:', summary.total_tax]);
    worksheet.addRow(['إجمالي الخصومات:', summary.total_discount]);
    worksheet.addRow([]);

    // Headers
    const headers = ['رقم الفاتورة', 'التاريخ', 'المورد', 'الإجمالي', 'الضريبة', 'الخصم', 'الصافي'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFBE9E7' }
    };

    // Data
    purchasesData.forEach(purchase => {
        worksheet.addRow([
            purchase.invoice_number || '',
            purchase.invoice_date || '',
            purchase.supplier?.name || '',
            parseFloat(purchase.total_amount || 0),
            parseFloat(purchase.tax_amount || 0),
            parseFloat(purchase.discount_amount || 0),
            parseFloat(purchase.total_amount || 0) - parseFloat(purchase.discount_amount || 0)
        ]);
    });

    worksheet.columns.forEach(column => {
        column.width = 15;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Expenses Report to Excel
 */
const exportExpensesReport = async (expensesData, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير المصروفات');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير المصروفات التفصيلي';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي المصروفات:', summary.total_expenses]);
    worksheet.addRow(['المبلغ الكلي:', summary.total_amount]);
    worksheet.addRow([]);

    // Headers
    const headers = ['التاريخ', 'الفئة', 'الدكتور', 'الطرف', 'مدفوع لحساب', 'مدفوع من حساب', 'الوصف', 'المبلغ', 'الملاحظات'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFF3E0' }
    };

    // Data
    expensesData.forEach(expense => {
        worksheet.addRow([
            expense.expense_date || '',
            'غير مصنف',
            expense.doctor?.name || '',
            expense.party?.name || '',
            expense.debitAccount?.name || '',
            expense.creditAccount?.name || '',
            expense.description || '',
            parseFloat(expense.amount || 0),
            expense.notes || ''
        ]);
    });

    worksheet.columns.forEach(column => {
        column.width = 15;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Job Orders Report to Excel
 */
const exportJobOrdersReport = async (jobOrdersData, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير أوامر التشغيل');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير أوامر التشغيل';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الأوامر:', summary.total_orders]);
    worksheet.addRow(['مكتمل:', summary.completed]);
    worksheet.addRow(['قيد التنفيذ:', summary.in_progress]);
    worksheet.addRow(['مخطط:', summary.planned]);
    worksheet.addRow(['ملغي:', summary.cancelled]);
    worksheet.addRow(['إجمالي التكلفة:', summary.total_cost]);
    worksheet.addRow([]);

    // Headers
    const headers = ['ID', 'المورد', 'المنتج', 'الكمية المطلوبة', 'الكمية المنتجة', 'الحالة', 'تاريخ البدء', 'التكلفة الفعلية'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' }
    };

    // Data
    jobOrdersData.forEach(jo => {
        worksheet.addRow([
            jo.id,
            jo.party?.name || '',
            jo.product?.name || '',
            parseFloat(jo.order_quantity || 0),
            parseFloat(jo.produced_quantity || 0),
            jo.status || '',
            jo.start_date || '',
            parseFloat(jo.total_actual_cost || 0)
        ]);
    });

    worksheet.columns.forEach(column => {
        column.width = 15;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Customer Statement to Excel
 */
const exportCustomerStatement = async (statementData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('كشف حساب');

    // Set RTL
    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `كشف حساب: ${statementData.customer?.name || ''}`;
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF1A237E' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Info Section
    worksheet.addRow([]);
    worksheet.addRow(['العميل:', statementData.customer?.name || '']);
    worksheet.addRow(['التاريخ:', new Date().toLocaleDateString('ar-EG')]);
    worksheet.addRow([]);

    // Summary Section
    const summaryHeader = worksheet.addRow(['الملخص المالي']);
    summaryHeader.font = { bold: true, size: 12 };

    worksheet.addRow(['الرصيد الختامي:', parseFloat(statementData.closing_balance || 0)]);
    worksheet.addRow([]);

    // Payments Summary by Date
    const paymentsByDate = (statementData.statement || [])
        .filter(row => row.type === 'payment')
        .reduce((acc, row) => {
            const date = (row.date || '').slice(0, 10);
            acc[date] = (acc[date] || 0) + parseFloat(row.credit || 0);
            return acc;
        }, {});

    const paymentsSummary = Object.entries(paymentsByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (paymentsSummary.length > 0) {
        const paySummaryTitle = worksheet.addRow(['إجمالي السداد بالتاريخ']);
        paySummaryTitle.font = { bold: true, color: { argb: 'FF2E7D32' } };
        
        paymentsSummary.forEach(item => {
            worksheet.addRow([item.date, 'إجمالي سداد اليوم', '', item.amount]);
        });
        worksheet.addRow([]);
    }

    // Table Headers
    const headers = ['التاريخ', 'الوصف', 'مدين', 'دائن', 'الرصيد'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3F51B5' }
        };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Data Rows
    let totalDebit = 0;
    let totalCredit = 0;

    statementData.statement.forEach(row => {
        const debit = parseFloat(row.debit || 0);
        const credit = parseFloat(row.credit || 0);
        totalDebit += debit;
        totalCredit += credit;

        const dataRow = worksheet.addRow([
            row.date || '',
            row.description || '',
            debit,
            credit,
            parseFloat(row.running_balance || 0)
        ]);
        dataRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        });
    });

    // Footer Row (Totals)
    const footerRow = worksheet.addRow([
        '',
        'الإجمالي',
        totalDebit,
        totalCredit,
        parseFloat(statementData.closing_balance || 0)
    ]);
    footerRow.font = { bold: true };
    footerRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2) { // Skip date column
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8EAF6' }
            };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Formatting
    worksheet.columns = [
        { width: 15 }, // Date
        { width: 40 }, // Description
        { width: 15 }, // Debit
        { width: 15 }, // Credit
        { width: 15 }  // Balance
    ];

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Customer Receivables Report to Excel
 */
const exportCustomerReceivablesReport = async (data, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('مستحقات العملاء');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير مستحقات العملاء';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['عدد العملاء:', summary.total_customers]);
    worksheet.addRow(['إجمالي المستحقات:', summary.total_receivables]);
    worksheet.addRow([]);

    // Headers
    const headers = ['العميل', 'رقم الهاتف', 'المدينة', 'الموظف', 'إجمالي المبيعات', 'إجمالي السداد', 'المرتجعات', 'الرصيد الحالي'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0F7FA' }
    };

    // Data
    data.forEach(row => {
        worksheet.addRow([
            row.name || '',
            row.phone || '',
            row.city_name || '',
            row.employee_name || '',
            parseFloat(row.total_sales || 0),
            parseFloat(row.total_payments || 0),
            parseFloat(row.total_returns || 0),
            parseFloat(row.net_balance || 0)
        ]);
    });

    // Formatting
    worksheet.columns.forEach(column => {
        column.width = 18;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Safe Movements Report to Excel
 */
const exportSafeMovementsReport = async (reportData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('حركة الصندوق');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    const isConsolidated = reportData.account.id === 'all';
    const lastColLetter = isConsolidated ? 'H' : 'G';
    worksheet.mergeCells(`A1:${lastColLetter}1`);
    const titleCell = worksheet.getCell('A1');
    titleCell.value = reportData.account.name;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Period & Opening
    worksheet.addRow([]);
    worksheet.addRow(['خلال الفترة من:', reportData.period.startDate, 'إلى:', reportData.period.endDate]);
    worksheet.addRow(['الرصيد الافتتاحي:', parseFloat(reportData.openingBalance || 0)]);
    worksheet.addRow([]);

    // Headers
    const headers = ['التاريخ', 'البيان', ...(isConsolidated ? ['الصندوق'] : []), 'رقم المرجع', 'الحساب المقابل', 'وارد (مدين)', 'منصرف (دائن)', 'الرصيد'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF1F8E9' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center' };
    });

    // Data
    reportData.movements.forEach(m => {
        const rowData = [
            m.date || '',
            m.description || '',
            ...(isConsolidated ? [m.account_name || ''] : []),
            m.reference_no || '',
            m.contra_account || '',
            parseFloat(m.debit || 0),
            parseFloat(m.credit || 0),
            parseFloat(m.balance || 0)
        ];
        const row = worksheet.addRow(rowData);
        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        });
    });

    // Summary/Totals
    const totalRow = worksheet.addRow([
        '', 'الإجمالي', ...(isConsolidated ? [''] : []), '', '',
        parseFloat(reportData.summary.totalDebit || 0),
        parseFloat(reportData.summary.totalCredit || 0),
        parseFloat(reportData.summary.closingBalance || 0)
    ]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Formatting
    worksheet.columns = [
        { width: 15 }, // Date
        { width: 35 }, // Description
        { width: 15 }, // Reference
        { width: 25 }, // Contra
        { width: 15 }, // Debit
        { width: 15 }, // Credit
        { width: 15 }  // Balance
    ];

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export General Ledger Report to Excel
 */
const exportGeneralLedgerReport = async (reportData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('كشف حساب');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `كشف حساب: ${reportData.account.name}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Period & Opening
    worksheet.addRow([]);
    worksheet.addRow(['خلال الفترة من:', reportData.period.startDate, 'إلى:', reportData.period.endDate]);
    worksheet.addRow(['الرصيد الافتتاحي:', parseFloat(reportData.openingBalance || 0)]);
    worksheet.addRow([]);

    // Headers
    const headers = ['التاريخ', 'البيان', 'رقم المرجع', 'الحساب المقابل', 'مدين', 'دائن', 'الرصيد'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE3F2FD' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center' };
    });

    // Data
    reportData.movements.forEach(m => {
        const rowData = [
            m.date || '',
            m.description || '',
            m.reference_no || '',
            m.contra_account || '',
            parseFloat(m.debit || 0),
            parseFloat(m.credit || 0),
            parseFloat(m.balance || 0)
        ];
        const row = worksheet.addRow(rowData);
        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        });
    });

    // Summary/Totals
    const totalRow = worksheet.addRow([
        '', 'الإجمالي', '', '',
        parseFloat(reportData.summary.totalDebit || 0),
        parseFloat(reportData.summary.totalCredit || 0),
        parseFloat(reportData.summary.closingBalance || 0)
    ]);
    totalRow.font = { bold: true };
    totalRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE3F2FD' } };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Formatting
    worksheet.columns = [
        { width: 15 }, // Date
        { width: 35 }, // Description
        { width: 15 }, // Reference
        { width: 25 }, // Contra
        { width: 15 }, // Debit
        { width: 15 }, // Credit
        { width: 15 }  // Balance
    ];

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Issue Vouchers List Report to Excel
 */
const exportIssueVouchersListReport = async (data, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير أذونات الصرف');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير أذونات الصرف التفصيلي';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الأذونات:', summary.total_vouchers]);
    worksheet.addRow(['إجمالي الكمية:', summary.total_items]);
    worksheet.addRow(['إجمالي التكلفة:', summary.total_cost]);
    worksheet.addRow([]);

    // Headers
    const headers = ['رقم الإذن', 'التاريخ', 'الموظف المسؤول', 'الدكتور', 'الجهة/العميل', 'المخزن', 'إجمالي التكلفة'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' }
    };

    // Data
    data.forEach(voucher => {
        // Voucher main row
        const voucherRow = worksheet.addRow([
            voucher.voucher_no || '',
            voucher.issue_date || '',
            voucher.responsible_employee?.name || '',
            voucher.doctor?.name || '',
            voucher.party?.name || '',
            voucher.warehouse?.name || '',
            parseFloat(voucher.total_cost || 0)
        ]);
        voucherRow.font = { bold: true };
        voucherRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF5F5F5' }
        };

        // Item Header Row
        const itemHeader = worksheet.addRow(['', 'م', 'اسم الصنف', 'الكمية', 'ت. الوحدة', 'إجمالي الصنف']);
        itemHeader.font = { italic: true, bold: true, size: 10, color: { argb: 'FF455A64' } };

        // Item Data
        if (voucher.items && voucher.items.length > 0) {
            voucher.items.forEach((item, index) => {
                worksheet.addRow([
                    '', // Spacing
                    index + 1,
                    item.product?.name || 'غير معروف',
                    parseFloat(item.quantity || 0),
                    parseFloat(item.product?.cost_price || 0),
                    parseFloat(item.total_cost || 0)
                ]);
            });
        }

        worksheet.addRow([]); // Blank row for spacing between records
    });

    worksheet.columns.forEach(column => {
        column.width = 22;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Issue Vouchers Employee Summary Report to Excel
 */
const exportIssueVouchersEmployeeReport = async (data, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('إجمالي صرف الموظفين');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير إجمالي المنتجات المنصرفة لكل موظف';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الكمية:', summary.total_items]);
    worksheet.addRow(['إجمالي التكلفة:', summary.total_cost]);
    worksheet.addRow([]);

    // Headers
    const headers = ['الموظف', 'الدكتور', 'الحساب', 'الجهة', 'نوع الجهة', 'المنتج', 'الكمية المنصرفة', 'إجمالي التكلفة'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' }
    };

    const partyTypeNames = { customer: 'عميل', supplier: 'مورد', both: 'مورد وعميل' };

    // Data
    data.forEach(row => {
        worksheet.addRow([
            row.employee_name || '',
            row.doctor_name || '',
            row.account_name || '',
            row.party_name || '',
            partyTypeNames[row.party_type] || row.party_type || '',
            row.product_name || '',
            parseFloat(row.total_quantity || 0),
            parseFloat(row.total_cost || 0)
        ]);
    });

    worksheet.columns.forEach(column => {
        column.width = 22;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Detailed Customer Statement to Excel (with item breakdown)
 */
const exportDetailedCustomerStatement = async (statementData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('كشف حساب تفصيلي');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `كشف حساب تفصيلي: ${statementData.customer?.name || ''}`;
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF00695C' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.addRow([]);
    worksheet.addRow(['العميل:', statementData.customer?.name || '']);
    worksheet.addRow(['التاريخ:', new Date().toLocaleDateString('ar-EG')]);
    worksheet.addRow(['الرصيد الافتتاحي:', parseFloat(statementData.opening_balance || 0)]);
    worksheet.addRow([]);

    // Payments Summary by Date
    const paymentsByDate = (statementData.statement || [])
        .filter(row => row.type === 'payment')
        .reduce((acc, row) => {
            const date = (row.date || '').slice(0, 10);
            acc[date] = (acc[date] || 0) + parseFloat(row.credit || 0);
            return acc;
        }, {});

    const paymentsSummary = Object.entries(paymentsByDate)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (paymentsSummary.length > 0) {
        const paySummaryTitle = worksheet.addRow(['إجمالي السداد بالتاريخ']);
        paySummaryTitle.font = { bold: true, color: { argb: 'FF00695C' } };
        
        paymentsSummary.forEach(item => {
            worksheet.addRow([item.date, 'إجمالي سداد اليوم', '', '', item.amount]);
        });
        worksheet.addRow([]);
    }

    // Table Headers
    const headers = ['التاريخ', 'النوع', 'الوصف', 'مدين', 'دائن', 'الرصيد'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00695C' } };
        cell.alignment = { horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    const typeNames = {
        invoice: 'فاتورة',
        payment: 'سداد',
        return: 'مرتجع',
        refund: 'رد نقدية',
        replacement: 'استبدال'
    };

    let totalDebit = 0;
    let totalCredit = 0;

    statementData.statement.forEach(row => {
        const debit = parseFloat(row.debit || 0);
        const credit = parseFloat(row.credit || 0);
        totalDebit += debit;
        totalCredit += credit;

        // Main transaction row
        const dataRow = worksheet.addRow([
            (row.date || '').slice(0, 10),
            typeNames[row.type] || row.type,
            row.description || '',
            debit,
            credit,
            parseFloat(row.running_balance || 0)
        ]);
        dataRow.font = { bold: true };
        dataRow.eachCell((cell) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { horizontal: 'center' };
        });

        // Item detail rows
        if (row.items && row.items.length > 0) {
            const itemHeaderRow = worksheet.addRow(['', '', 'المنتج', 'الكمية', 'السعر', 'الإجمالي']);
            itemHeaderRow.font = { italic: true, bold: true, size: 10, color: { argb: 'FF455A64' } };
            itemHeaderRow.eachCell((cell, colNumber) => {
                if (colNumber >= 3) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                }
            });

            row.items.forEach(item => {
                const itemRow = worksheet.addRow([
                    '',
                    '',
                    item.product_name || '',
                    parseFloat(item.quantity || 0),
                    parseFloat(item.price || 0),
                    parseFloat(item.total || 0)
                ]);
                itemRow.font = { size: 10, color: { argb: 'FF616161' } };
                itemRow.eachCell((cell, colNumber) => {
                    if (colNumber >= 3) {
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                        cell.alignment = { horizontal: 'center' };
                    }
                });
            });
        }
    });

    // Footer Totals
    worksheet.addRow([]);
    const footerRow = worksheet.addRow(['', '', 'الإجمالي', totalDebit, totalCredit, parseFloat(statementData.closing_balance || 0)]);
    footerRow.font = { bold: true, size: 12 };
    footerRow.eachCell((cell, colNumber) => {
        if (colNumber >= 3) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2F1' } };
            cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Column widths
    worksheet.columns = [
        { width: 15 },  // Date
        { width: 12 },  // Type
        { width: 40 },  // Description / Product
        { width: 15 },  // Debit / Qty
        { width: 15 },  // Credit / Price
        { width: 15 }   // Balance / Total
    ];

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Supplier Statement to Excel
 */
const exportSupplierStatement = async (statementData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('كشف حساب');

    // Set RTL
    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `كشف حساب: ${statementData.supplier?.name || ''}`;
    titleCell.font = { size: 18, bold: true, color: { argb: 'FF1A237E' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Info Section
    worksheet.addRow([]);
    worksheet.addRow(['المورد:', statementData.supplier?.name || '']);
    worksheet.addRow(['التاريخ:', new Date().toLocaleDateString('ar-EG')]);
    worksheet.addRow([]);

    // Summary Section
    const summaryHeader = worksheet.addRow(['الملخص المالي']);
    summaryHeader.font = { bold: true, size: 12 };

    worksheet.addRow(['الرصيد الختامي:', parseFloat(statementData.closing_balance || 0)]);
    worksheet.addRow([]);

    // Table Headers
    const headers = ['التاريخ', 'الوصف', 'مدين', 'دائن', 'الرصيد'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3F51B5' }
        };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Data Rows
    let totalDebit = 0;
    let totalCredit = 0;

    statementData.statement.forEach(row => {
        const debit = parseFloat(row.debit || 0);
        const credit = parseFloat(row.credit || 0);
        totalDebit += debit;
        totalCredit += credit;

        const dataRow = worksheet.addRow([
            row.date || '',
            row.description || '',
            debit,
            credit,
            parseFloat(row.running_balance || 0)
        ]);
        dataRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        });
    });

    // Footer Row (Totals)
    const footerRow = worksheet.addRow([
        '',
        'الإجمالي',
        totalDebit,
        totalCredit,
        parseFloat(statementData.closing_balance || 0)
    ]);
    footerRow.font = { bold: true };
    footerRow.eachCell((cell, colNumber) => {
        if (colNumber >= 2) { // Skip date column
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8EAF6' }
            };
            cell.border = {
                top: { style: 'medium' },
                left: { style: 'thin' },
                bottom: { style: 'medium' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        }
    });

    // Formatting
    worksheet.columns = [
        { width: 15 }, // Date
        { width: 40 }, // Description
        { width: 15 }, // Debit
        { width: 15 }, // Credit
        { width: 15 }  // Balance
    ];

    return await workbook.xlsx.writeBuffer();
};





/**
 * Export Cross Region Report to Excel
 */
const exportCrossRegionReport = async (reportData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('المخالفات الجغرافية للمخازن');

    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `تقرير المخالفات الجغرافية للمخازن - مخزن: ${reportData.warehouse?.name || ''}`;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Info
    worksheet.addRow([]);
    worksheet.addRow(['اسم المخزن:', reportData.warehouse?.name || '']);
    worksheet.addRow(['منطقة المخزن:', reportData.warehouse?.region || '']);
    worksheet.addRow(['تاريخ التصدير:', new Date().toLocaleDateString('ar-EG')]);
    worksheet.addRow([]);

    // Headers
    const headers = [
        'نوع الحركة',
        'رقم السند',
        'التاريخ',
        'العميل/الجهة',
        'منطقة العميل',
        'اسم المخزن',
        'منطقة المخزن',
        'القيمة',
        'ملاحظات'
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFECEB' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center' };
    });

    // Data
    (reportData.transactions || []).forEach(tr => {
        const row = worksheet.addRow([
            tr.typeLabel || '',
            tr.referenceNo || '',
            tr.date || '',
            tr.partyName || '',
            tr.partyRegion || '',
            tr.warehouseName || '',
            tr.warehouseRegion || '',
            tr.amount !== null ? parseFloat(tr.amount || 0) : '-',
            tr.notes || ''
        ]);
        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
        });
    });

    worksheet.columns.forEach(column => {
        column.width = 18;
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Batch Customer Statements to Excel (one sheet per customer + summary sheet)
 */
const exportBatchCustomerStatements = async (batchData) => {
    const workbook = new ExcelJS.Workbook();

    // ─── Summary Sheet ───────────────────────────────────────────────────────────
    const summarySheet = workbook.addWorksheet('ملخص العملاء');
    summarySheet.views = [{ rightToLeft: true }];

    // Title
    summarySheet.mergeCells('A1:F1');
    const sumTitle = summarySheet.getCell('A1');
    sumTitle.value = 'ملخص كشوف حسابات العملاء - حسب المنطقة';
    sumTitle.font = { size: 16, bold: true, color: { argb: 'FF1A237E' } };
    sumTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    sumTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
    summarySheet.getRow(1).height = 30;

    summarySheet.addRow([]);

    // Totals banner
    const totalCustomers = batchData.length;
    const totalDebitAll = batchData.reduce((s, stmt) =>
        s + stmt.statement.reduce((a, r) => a + parseFloat(r.debit || 0), 0), 0);
    const totalCreditAll = batchData.reduce((s, stmt) =>
        s + stmt.statement.reduce((a, r) => a + parseFloat(r.credit || 0), 0), 0);
    const totalBalance = batchData.reduce((s, stmt) => s + parseFloat(stmt.closing_balance || 0), 0);

    const metaRows = [
        ['إجمالي عدد العملاء:', totalCustomers],
        ['إجمالي المديونيات (مدين):', parseFloat(totalDebitAll.toFixed(2))],
        ['إجمالي المدفوعات (دائن):', parseFloat(totalCreditAll.toFixed(2))],
        ['صافي المستحق الإجمالي:', parseFloat(totalBalance.toFixed(2))],
    ];

    metaRows.forEach(([label, val]) => {
        const row = summarySheet.addRow([label, val]);
        row.getCell(1).font = { bold: true };
        row.getCell(2).font = { bold: true, color: { argb: 'FF1565C0' } };
        row.getCell(2).numFmt = '#,##0.00';
    });

    summarySheet.addRow([]);

    // Summary table headers
    const sumHeaders = ['م', 'اسم العميل', 'الرصيد الافتتاحي', 'إجمالي المدين', 'إجمالي الدائن', 'الرصيد الختامي'];
    const sumHeaderRow = summarySheet.addRow(sumHeaders);
    sumHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sumHeaderRow.height = 22;
    sumHeaderRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A237E' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
        };
    });

    // Summary data rows
    batchData.forEach((stmt, idx) => {
        const totalDebit = stmt.statement.reduce((a, r) => a + parseFloat(r.debit || 0), 0);
        const totalCredit = stmt.statement.reduce((a, r) => a + parseFloat(r.credit || 0), 0);
        const closingBal = parseFloat(stmt.closing_balance || 0);

        const row = summarySheet.addRow([
            idx + 1,
            stmt.customer?.name || '',
            parseFloat(stmt.opening_balance || 0),
            parseFloat(totalDebit.toFixed(2)),
            parseFloat(totalCredit.toFixed(2)),
            closingBal
        ]);

        row.eachCell((cell, col) => {
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' }
            };
            cell.alignment = { horizontal: col === 2 ? 'right' : 'center', vertical: 'middle' };
            if (col >= 3) cell.numFmt = '#,##0.00';
        });

        // Highlight debtors
        if (closingBal > 0) {
            row.getCell(6).font = { bold: true, color: { argb: 'FFC62828' } };
        } else if (closingBal < 0) {
            row.getCell(6).font = { bold: true, color: { argb: 'FF2E7D32' } };
        }

        // Alternate row shading
        if (idx % 2 === 0) {
            row.eachCell(cell => {
                if (!cell.fill || cell.fill.fgColor?.argb === 'FFFFFFFF') {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
                }
            });
        }
    });

    // Totals row
    const sumTotalRow = summarySheet.addRow([
        '', 'الإجمالي الكلي', '', parseFloat(totalDebitAll.toFixed(2)),
        parseFloat(totalCreditAll.toFixed(2)), parseFloat(totalBalance.toFixed(2))
    ]);
    sumTotalRow.font = { bold: true };
    sumTotalRow.eachCell((cell, col) => {
        if (col >= 2) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
            cell.border = {
                top: { style: 'medium' }, left: { style: 'thin' },
                bottom: { style: 'medium' }, right: { style: 'thin' }
            };
            cell.alignment = { horizontal: 'center' };
            if (col >= 3) cell.numFmt = '#,##0.00';
        }
    });

    summarySheet.columns = [
        { width: 6 }, { width: 30 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }
    ];

    // ─── One sheet per customer ───────────────────────────────────────────────────
    const typeLabels = { invoice: 'فاتورة', payment: 'سداد', return: 'مرتجع', refund: 'رد نقدي', replacement: 'استبدال' };
    const typeColors = {
        invoice:     'FFE3F2FD',
        payment:     'FFE8F5E9',
        return:      'FFFFF3E0',
        refund:      'FFFCE4EC',
        replacement: 'FFF3E5F5'
    };

    batchData.forEach((stmt, idx) => {
        // Excel sheet name max 31 chars, no special chars
        const safeName = (stmt.customer?.name || `عميل ${idx + 1}`)
            .replace(/[\/\\?*\[\]]/g, '')
            .substring(0, 28);
        const sheetName = `${idx + 1}_${safeName}` || `عميل_${idx + 1}`;

        const ws = workbook.addWorksheet(sheetName.substring(0, 31));
        ws.views = [{ rightToLeft: true }];

        // Title
        ws.mergeCells('A1:F1');
        const wsTitle = ws.getCell('A1');
        wsTitle.value = `كشف حساب تفصيلي: ${stmt.customer?.name || ''}`;
        wsTitle.font = { size: 15, bold: true, color: { argb: 'FF00695C' } };
        wsTitle.alignment = { horizontal: 'center', vertical: 'middle' };
        wsTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2F1' } };
        ws.getRow(1).height = 28;

        ws.addRow([]);
        ws.addRow(['الرصيد الافتتاحي:', parseFloat(stmt.opening_balance || 0)]).getCell(2).numFmt = '#,##0.00';
        ws.addRow(['تاريخ الطباعة:', new Date().toLocaleDateString('ar-EG')]);
        ws.addRow([]);

        // Table headers
        const detailHeaders = ['التاريخ', 'النوع', 'البيان', 'مدين', 'دائن', 'الرصيد'];
        const detailHeaderRow = ws.addRow(detailHeaders);
        detailHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        detailHeaderRow.height = 20;
        detailHeaderRow.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00695C' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' }
            };
        });

        // Statement rows
        let totalDebit = 0, totalCredit = 0;
        stmt.statement.forEach(row => {
            const debit = parseFloat(row.debit || 0);
            const credit = parseFloat(row.credit || 0);
            totalDebit += debit;
            totalCredit += credit;

            const dataRow = ws.addRow([
                row.date ? row.date.slice(0, 10) : '',
                typeLabels[row.type] || row.type,
                row.description || '',
                debit || '',
                credit || '',
                parseFloat(row.running_balance || 0)
            ]);
            dataRow.font = { bold: true };

            const bgColor = typeColors[row.type] || 'FFFFFFFF';
            dataRow.eachCell((cell, col) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: col === 3 ? 'right' : 'center', vertical: 'middle' };
                if (col >= 4) cell.numFmt = '#,##0.00';
            });

            // Item detail rows
            if (row.items && row.items.length > 0) {
                const itemHeaderRow = ws.addRow(['', '', 'المنتج', 'الكمية', 'السعر', 'الإجمالي']);
                itemHeaderRow.font = { italic: true, bold: true, size: 10, color: { argb: 'FF455A64' } };
                itemHeaderRow.eachCell((cell, colNumber) => {
                    if (colNumber >= 3) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
                        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                    }
                });

                row.items.forEach(item => {
                    const itemRow = ws.addRow([
                        '',
                        '',
                        item.product_name || '',
                        parseFloat(item.quantity || 0),
                        parseFloat(item.price || 0),
                        parseFloat(item.total || 0)
                    ]);
                    itemRow.font = { size: 10, color: { argb: 'FF616161' } };
                    itemRow.eachCell((cell, colNumber) => {
                        if (colNumber >= 3) {
                            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            cell.alignment = { horizontal: 'center' };
                        }
                    });
                });
            }
        });

        // Closing row
        const closingBal = parseFloat(stmt.closing_balance || 0);
        const closingRow = ws.addRow([
            '', '', 'الرصيد الختامي',
            parseFloat(totalDebit.toFixed(2)),
            parseFloat(totalCredit.toFixed(2)),
            closingBal
        ]);
        closingRow.font = { bold: true };
        closingRow.eachCell((cell, col) => {
            if (col >= 3) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2F1' } };
                cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center' };
                if (col >= 4) cell.numFmt = '#,##0.00';
            }
        });
        if (closingBal > 0) closingRow.getCell(6).font = { bold: true, color: { argb: 'FFC62828' } };
        else if (closingBal < 0) closingRow.getCell(6).font = { bold: true, color: { argb: 'FF2E7D32' } };

        ws.columns = [
            { width: 14 },  // Date
            { width: 12 },  // Type
            { width: 40 },  // Description / Product
            { width: 16 },  // Debit / Qty
            { width: 16 },  // Credit / Price
            { width: 16 }   // Balance / Total
        ];
    });

    return await workbook.xlsx.writeBuffer();
};

/**
 * Export Assets Report to Excel
 */
const exportAssetsReport = async (assetsData, summary) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('تقرير الأصول');

    // Set RTL
    worksheet.views = [{ rightToLeft: true }];

    // Title
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير أرصدة وحركات الأصول';
    titleCell.font = { size: 16, bold: true, color: { argb: 'FF1A237E' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Summary Info Card style rows
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الأصول الثابتة:', parseFloat(summary.total_fixed || 0)]);
    worksheet.addRow(['إجمالي الأصول المتداولة:', parseFloat(summary.total_current || 0)]);
    worksheet.addRow(['إجمالي الأصول:', parseFloat(summary.total_assets || 0)]);
    worksheet.addRow([]);

    // Headers
    const headers = ['رقم الحساب', 'اسم الحساب', 'تصنيف الأصل', 'رصيد أول المدة', 'مدين الفترة', 'دائن الفترة', 'الرصيد الختامي'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3F51B5' } // Indigo color to look premium
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Data
    assetsData.forEach(asset => {
        const opening = parseFloat(asset.opening_balance || 0);
        const debit = parseFloat(asset.debit || 0);
        const credit = parseFloat(asset.credit || 0);
        const closing = parseFloat(asset.closing_balance || 0);

        const dataRow = worksheet.addRow([
            asset.id,
            asset.name || '',
            asset.classification || '',
            opening,
            debit,
            credit,
            closing
        ]);

        dataRow.eachCell((cell, colIndex) => {
            cell.alignment = { horizontal: colIndex <= 3 ? 'center' : 'right', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };

            // Format numeric values
            if (colIndex >= 4) {
                cell.numFmt = '#,##0.00';
            }
        });

        // Style hierarchy header accounts (like 1, 8, 9, 40)
        if (asset.is_parent) {
            dataRow.font = { bold: true };
            dataRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE8EAF6' } // Very light indigo for group totals
                };
            });
        }
    });

    // Formatting
    worksheet.columns = [
        { width: 12 }, // Account ID
        { width: 25 }, // Name
        { width: 18 }, // Classification
        { width: 16 }, // Opening Balance
        { width: 16 }, // Debit
        { width: 16 }, // Credit
        { width: 16 }  // Closing Balance
    ];

    return await workbook.xlsx.writeBuffer();
};

export default {
    exportAssetsReport,
    exportSalesReport,
    exportPurchasesReport,
    exportExpensesReport,
    exportJobOrdersReport,
    exportCustomerStatement,
    exportDetailedCustomerStatement,
    exportCustomerReceivablesReport,
    exportSafeMovementsReport,
    exportGeneralLedgerReport,
    exportIssueVouchersEmployeeReport,
    exportIssueVouchersListReport,
    exportSupplierStatement,
    exportBatchCustomerStatements,
    exportCrossRegionReport
};
