const fs = require('fs');
const path = 'd:\\db\\server\\src\\services\\exportService.js';
let content = fs.readFileSync(path, 'utf8');

// Fix the broken line at 898 - the -replace command corrupted it
// The issue is "const exportSupplierStatement,\n    exportBatchCustomerStatements = async"
// It should be "const exportSupplierStatement = async"
content = content.replace(
    'const exportSupplierStatement,\n    exportBatchCustomerStatements = async',
    'const exportSupplierStatement = async'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed exportService.js');
