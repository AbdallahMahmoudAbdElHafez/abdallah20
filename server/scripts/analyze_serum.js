import fs from 'fs';

const data = JSON.parse(fs.readFileSync('d:/db/server/serum_debug.json', 'utf-8'));

console.log('=== PRODUCTS MATCHING SERUM ===');
const serumProds = data.products.filter(p => p.name.includes('سير') || p.name.toLowerCase().includes('serum'));
console.log(serumProds);

console.log('=== PRODUCTS 21 & 25 ===');
const p21_25 = data.products.filter(p => p.id === 21 || p.id === 25);
console.log(p21_25);

console.log('=== BOM FOR SERUM PRODUCTS ===');
const serumIds = serumProds.map(p => p.id);
const serumBOM = data.boms.filter(b => serumIds.includes(b.product_id));
console.log(serumBOM);

console.log('=== BOM CONTAINING 21 OR 25 ===');
const bom21_25 = data.boms.filter(b => b.material_id === 21 || b.material_id === 25);
console.log(bom21_25);

console.log('=== JOB ORDERS FOR SERUM ===');
const serumJobs = data.job_orders.filter(j => serumIds.includes(j.product_id));
console.log(serumJobs);

console.log('=== JOB ORDER ITEMS FOR SERUM JOBS OR 21/25 ===');
const jobIds = serumJobs.map(j => j.id);
const serumJobItems = data.job_order_items.filter(i => jobIds.includes(i.job_order_id) || i.product_id === 21 || i.product_id === 25);
console.log(serumJobItems);

console.log('=== ISSUE VOUCHERS ITEMS WITH 21 OR 25 ===');
if (data.issue_voucher_items) {
    const iv21_25 = data.issue_voucher_items.filter(i => i.product_id === 21 || i.product_id === 25);
    console.log(iv21_25);
}

console.log('=== ISSUE VOUCHER RETURNS WITH 21 OR 25 ===');
if (data.issue_voucher_return_items) {
    const ivr21_25 = data.issue_voucher_return_items.filter(i => i.product_id === 21 || i.product_id === 25);
    console.log(ivr21_25);
}
