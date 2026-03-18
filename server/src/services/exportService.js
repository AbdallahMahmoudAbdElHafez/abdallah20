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
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'تقرير المبيعات التفصيلي';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Add summary
    worksheet.addRow([]);
    worksheet.addRow(['إجمالي الفواتير:', summary.total_invoices]);
    worksheet.addRow(['إجمالي المبيعات:', summary.total_amount]);
    worksheet.addRow(['إجمالي الضرائب:', summary.total_tax]);
    worksheet.addRow(['إجمالي الخصومات:', summary.total_discount]);
    worksheet.addRow([]);

    // Add headers
    const headers = ['رقم الفاتورة', 'التاريخ', 'العميل', 'الإجمالي', 'الضريبة', 'الخصم', 'الصافي'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE3F2FD' }
    };

    // Add data
    salesData.forEach(sale => {
        worksheet.addRow([
            sale.invoice_number || '',
            sale.invoice_date || '',
            sale.customer?.name || '',
            parseFloat(sale.total_amount || 0),
            parseFloat(sale.tax_amount || 0),
            parseFloat(sale.discount_amount || 0),
            parseFloat(sale.total_amount || 0) - parseFloat(sale.discount_amount || 0)
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
    const headers = ['التاريخ', 'الفئة', 'مدفوع لحساب', 'مدفوع من حساب', 'الوصف', 'المبلغ', 'الملاحظات'];
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
    worksheet.mergeCells('A1:D1');
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
    const headers = ['الموظف', 'الدكتور', 'المنتج', 'الكمية المنصرفة', 'إجمالي التكلفة'];
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' }
    };

    // Data
    data.forEach(row => {
        worksheet.addRow([
            row.employee_name || '',
            row.doctor_name || '',
            row.product_name || '',
            parseFloat(row.total_quantity || 0),
            parseFloat(row.total_cost || 0)
        ]);
    });

    worksheet.columns.forEach(column => {
        column.width = 25;
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

export default {
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
    exportSupplierStatement
};
