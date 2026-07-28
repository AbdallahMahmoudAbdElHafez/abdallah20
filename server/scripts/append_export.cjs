const fs = require('fs');

const addition = `

/**
 * Export Batch Customer Statements to Excel
 */
const exportBatchCustomerStatements = async (batchStatementsData) => {
    const workbook = new ExcelJS.Workbook();
    
    const worksheet = workbook.addWorksheet('كشوف حساب العملاء');
    worksheet.views = [{ rightToLeft: true }];
    
    // Define columns
    worksheet.columns = [
        { width: 15 }, // Date
        { width: 40 }, // Description
        { width: 15 }, // Debit
        { width: 15 }, // Credit
        { width: 15 }  // Balance
    ];

    batchStatementsData.forEach((statementData, index) => {
        // Customer Title
        const titleRowInfo = worksheet.addRow(['', '', \`كشف حساب: \${statementData.customer?.name || ''}\`, '', '']);
        worksheet.mergeCells(\`C\${titleRowInfo.number}:E\${titleRowInfo.number}\`);
        titleRowInfo.font = { size: 16, bold: true, color: { argb: 'FF1A237E' } };
        titleRowInfo.alignment = { horizontal: 'center', vertical: 'middle' };
        
        worksheet.addRow(['العميل:', statementData.customer?.name || '']);
        worksheet.addRow(['الرصيد الافتتاحي:', parseFloat(statementData.opening_balance || 0)]);
        
        // Headers
        const headers = ['التاريخ', 'الوصف', 'مدين', 'دائن', 'الرصيد'];
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3F51B5' } };
            cell.alignment = { horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
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
                row.date ? row.date.toString().slice(0, 10) : '',
                row.description || '',
                debit,
                credit,
                parseFloat(row.running_balance || 0)
            ]);
            dataRow.eachCell((cell) => {
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center' };
            });
        });

        // Footer Row
        const footerRow = worksheet.addRow([
            '',
            'الإجمالي',
            totalDebit,
            totalCredit,
            parseFloat(statementData.closing_balance || 0)
        ]);
        footerRow.font = { bold: true };
        footerRow.eachCell((cell, colNumber) => {
            if (colNumber >= 2) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EAF6' } };
                cell.border = { top: { style: 'medium' }, left: { style: 'thin' }, bottom: { style: 'medium' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center' };
            }
        });

        // Add some spacing before next customer
        worksheet.addRow([]);
        worksheet.addRow([]);
        worksheet.addRow([]);
    });

    return await workbook.xlsx.writeBuffer();
};
`;

let content = fs.readFileSync('d:\\db\\server\\src\\services\\exportService.js', 'utf8');

// Also fix the export default object to include exportBatchCustomerStatements
content = content.replace(/exportSupplierStatement\r?\n\};\r?\n?$/, 'exportSupplierStatement,\n    exportBatchCustomerStatements\n};\n');

content += addition;

fs.writeFileSync('d:\\db\\server\\src\\services\\exportService.js', content, 'utf8');
