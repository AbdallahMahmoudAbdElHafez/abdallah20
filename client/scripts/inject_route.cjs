const fs = require('fs');
let content = fs.readFileSync('d:\\db\\client\\src\\App.jsx', 'utf8');

content = content.replace(
    'import CustomerReceivablesReportPage from "./pages/CustomerReceivablesReportPage";',
    'import CustomerReceivablesReportPage from "./pages/CustomerReceivablesReportPage";\nimport BatchCustomerStatementsPage from "./pages/BatchCustomerStatementsPage";'
);

content = content.replace(
    '<Route path="/reports/customer-receivables" element={<CustomerReceivablesReportPage />} />',
    '<Route path="/reports/customer-receivables" element={<CustomerReceivablesReportPage />} />\n            <Route path="/reports/batch-customer-statements" element={<BatchCustomerStatementsPage />} />'
);

fs.writeFileSync('d:\\db\\client\\src\\App.jsx', content, 'utf8');
