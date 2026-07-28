const fs = require('fs');
const path = 'd:\\db\\client\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Remove duplicate import
const duplicateLine = 'import BatchCustomerStatementsPage from "./pages/BatchCustomerStatementsPage";\n';
const firstIdx = content.indexOf(duplicateLine);
const secondIdx = content.indexOf(duplicateLine, firstIdx + duplicateLine.length);
if (secondIdx !== -1) {
    content = content.substring(0, secondIdx) + content.substring(secondIdx + duplicateLine.length);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Removed duplicate import');
} else {
    console.log('No duplicate found');
}

// Also check for duplicate route
const routeStr = '<Route path="/reports/batch-customer-statements" element={<BatchCustomerStatementsPage />} />\n';
const routeFirst = content.indexOf(routeStr);
const routeSecond = content.indexOf(routeStr, routeFirst + routeStr.length);
if (routeSecond !== -1) {
    content = content.substring(0, routeSecond) + content.substring(routeSecond + routeStr.length);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Removed duplicate route');
} else {
    console.log('No duplicate route found');
}
