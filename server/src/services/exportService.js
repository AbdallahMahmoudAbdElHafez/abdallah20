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
    const headers = ['التاريخ', 'الفئة', 'الوصف', 'المبلغ', 'الملاحظات'];
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

export default {
    exportSalesReport,
    exportPurchasesReport,
    exportExpensesReport,
    exportJobOrdersReport,
    exportCustomerStatement
};
