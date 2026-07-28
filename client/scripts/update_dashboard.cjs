const fs = require('fs');

const path = 'd:\\db\\client\\src\\pages\\ReportsDashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = `          {
              title: 'تقرير مستحقات العملاء',
              description: 'عرض أرصدة ومستحقات جميع العملاء',
              icon: <SalesIcon sx={{ fontSize: 60, color: '#607d8b' }} />,
              path: '/reports/customer-receivables',
              color: '#eceff1'
          },`;

const replacement = `          {
              title: 'تقرير مستحقات العملاء',
              description: 'عرض أرصدة ومستحقات جميع العملاء',
              icon: <SalesIcon sx={{ fontSize: 60, color: '#607d8b' }} />,
              path: '/reports/customer-receivables',
              color: '#eceff1'
          },
          {
              title: 'كشوف حساب العملاء حسب المنطقة',
              description: 'استعراض وطباعة كشوف حسابات العملاء مجمعة حسب المحافظة والمدينة',
              icon: <AssessmentIcon sx={{ fontSize: 60, color: '#00796b' }} />,
              path: '/reports/batch-customer-statements',
              color: '#e0f2f1'
          },`;

content = content.replace(targetStr, replacement);
fs.writeFileSync(path, content, 'utf8');
