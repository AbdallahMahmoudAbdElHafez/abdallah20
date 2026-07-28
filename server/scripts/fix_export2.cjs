const fs = require('fs');
const path = 'd:\\db\\server\\src\\services\\exportService.js';
let content = fs.readFileSync(path, 'utf8');

console.log('Has export default:', content.includes('export default'));
console.log('Has exportBatchCustomerStatements:', content.includes('exportBatchCustomerStatements'));

// Add export default if missing
if (!content.includes('export default')) {
    const exportDefault = `
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
    exportSupplierStatement,
    exportBatchCustomerStatements
};
`;
    content += exportDefault;
    fs.writeFileSync(path, content, 'utf8');
    console.log('Added export default');
} else {
    console.log('Export default already exists');
}
