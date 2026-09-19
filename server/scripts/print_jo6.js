import fs from 'fs';

const d = JSON.parse(fs.readFileSync('d:/db/server/jo6_full_analysis.json', 'utf-8'));

console.log('=== PARTY 74 ===');
console.log(d.party_74);

console.log('=== JOB ORDER 6 ===');
console.log(d.job_order_6);

console.log('=== ITEMS (MATERIALS SENT) ===');
console.log(d.items);

console.log('=== SERVICES ===');
console.log(d.services);

console.log('=== COST TRANSACTIONS ===');
console.log(d.cost_transactions);

console.log('=== SERVICE INVOICES ===');
console.log(d.service_invoices);

console.log('=== JOURNAL ENTRIES ===');
console.log(d.journal_entries);

console.log('=== INVENTORY TRANSACTIONS ===');
console.log(d.inv_transactions);

console.log('=== PURCHASES 21 & 25 ===');
console.log(d.purchases_21_25);
