import React from 'react';
import './InvoicePreview.css';

// Currency Formatter
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Or user preference
        minimumFractionDigits: 2
    }).format(amount || 0);
};

export default function InvoicePaper({ invoice, items, columns, type = 'sales', company, showPhone }) {
    if (!invoice) return null;

    // Helper to check if col is visible
    const showCol = (key) => columns.find(c => c.key === key)?.visible;

    // Determine type specific labels
    const isSales = type === 'sales';
    const partyLabel = isSales ? 'العميل' : 'المورد';
    const partyName = invoice.party?.name || invoice.supplier?.name || "N/A";
    const partyAddress = invoice.party?.address || invoice.supplier?.address || "العنوان غير متوفر";
    const partyPhone = invoice.party?.phone || invoice.supplier?.phone || "";

    const invoiceTitle = isSales ? "فاتورة مبيعات" : "فاتورة مشتريات";

    return (
        <div className="invoice-paper" dir="rtl">
            {/* Header */}
            <div className="inv-header">
                <div className="inv-company-info">
                    {company?.logo_path && (
                        <img
                            src={`http://localhost:5000/${company.logo_path}`}
                            alt="Company Logo"
                            style={{ maxHeight: '80px', marginBottom: '10px', display: 'block' }}
                        />
                    )}
                    <h1>{company?.company_name || 'شركة نوريفيناء'}</h1>
                    <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
                        {company?.city?.name && <span>{company.city.name}</span>}
                        {company?.address && <span>، {company.address}</span>}<br />
                        {showPhone && company?.phone && <span>هاتف: {company.phone}</span>}<br />
                        {company?.email && <span>البريد الإلكتروني: {company.email}</span>}<br />
                        {company?.commercial_register && <div>سجل تجاري : {company.commercial_register}</div>}
                        {company?.tax_number && <div>رقم التسجيل الضريبي : {company.tax_number}</div>}
                        {company?.vat_number && <div>رقم التسجيل الضريبي للقيمة المضافة : {company.vat_number}</div>}
                    </div>
                </div>
                <div className="inv-meta">
                    <div className="inv-meta-row">
                        <span className="inv-label">رقم الفاتورة:</span>
                        <span>{invoice.invoice_number}</span>
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">التاريخ:</span>
                        <span>{invoice.invoice_date}</span>
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">الحالة:</span>
                        <span style={{ textTransform: 'uppercase' }}>{invoice.status}</span>
                    </div>
                </div>
            </div >

            {/* Bill To */}
            < div className="inv-addresses" >
                <div className="inv-addr-block">
                    <div className="inv-addr-title">فاتورة إلى ({partyLabel})</div>
                    <strong>{partyName}</strong><br />
                    {partyAddress}<br />
                    {showPhone && partyPhone && <span>هاتف: {partyPhone}</span>}
                </div>
            </div >

            {/* Items Table */}
            < table className="inv-table" >
                <thead>
                    <tr>
                        <th>#</th>
                        {showCol('product') && <th>المنتج</th>}
                        {showCol('batch_number') && <th>رقم التشغيلة</th>}
                        {showCol('expiry_date') && <th>تاريخ الصلاحية</th>}
                        {showCol('quantity') && <th>الكمية</th>}
                        {showCol('bonus') && <th>بونص</th>}
                        {showCol('unit_price') && <th>السعر</th>}
                        {showCol('total_before_discount') && <th>الإجمالي قبل الخصم</th>}
                        {showCol('discount_percent') && <th>نسبة الخصم</th>}
                        {showCol('discount') && <th>قيمة الخصم</th>}
                        {showCol('tax') && <th>الضريبة</th>}
                        {showCol('total') && <th>الإجمالي</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const qty = Number(item.quantity) || 0;
                        const price = Number(item.price || item.unit_price) || 0;
                        const discountVal = Number(item.discount) || 0;
                        const bonus = Number(item.bonus) || 0;
                        const totalBeforeDiscount = qty * price;

                        // Calculate percent if strictly not present
                        let discountPercent = Number(item.discount_percent);
                        if (isNaN(discountPercent) && price > 0 && qty > 0) {
                            discountPercent = (discountVal / (qty * price)) * 100;
                        }
                        discountPercent = discountPercent || 0;

                        const tax = 0; // If item based tax exists
                        const lineTotal = (qty * price) - discountVal;

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                {showCol('product') && <td>{item.product_name || item.product?.name || item.Product?.name || "منتج غير معروف"}</td>}
                                {showCol('batch_number') && <td>{item.inventory_transactions?.[0]?.transaction_batches?.[0]?.batch?.batch_number || item.batch_number || "-"}</td>}
                                {showCol('expiry_date') && <td>{item.inventory_transactions?.[0]?.transaction_batches?.[0]?.batch?.expiry_date || item.expiry_date || "-"}</td>}
                                {showCol('quantity') && <td>{qty}</td>}
                                {showCol('bonus') && <td>{bonus}</td>}
                                {showCol('unit_price') && <td>{formatCurrency(price)}</td>}
                                {showCol('total_before_discount') && <td>{formatCurrency(totalBeforeDiscount)}</td>}
                                {showCol('discount_percent') && <td>{discountPercent.toFixed(2)}%</td>}
                                {showCol('discount') && <td>{formatCurrency(discountVal)}</td>}
                                {showCol('tax') && <td>-</td>}
                                {showCol('total') && <td>{formatCurrency(lineTotal)}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table >

            {/* Totals */}
            < div className="inv-totals" >
                <div className="inv-totals-box">
                    <div className="inv-total-row">
                        <span>المجموع الفرعي:</span>
                        <span>{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    <div className="inv-total-row">
                        <span>الخصم الإضافي:</span>
                        <span>{formatCurrency(invoice.additional_discount)}</span>
                    </div>
                    {(Number(invoice.vat_amount) > 0) && (
                        <div className="inv-total-row">
                            <span>ضريبة القيمة المضافة:</span>
                            <span>{formatCurrency(invoice.vat_amount)}</span>
                        </div>
                    )}
                    <div className="inv-total-row final">
                        <span>الإجمالي النهائي:</span>
                        <span>{formatCurrency(invoice.total_amount)}</span>
                    </div>
                </div>
            </div >

            {/* Footer */}
            < div className="inv-footer" >
                <p>شكراً لتعاملكم معنا!</p>
                <p>صنعت بواسطة نظام نوريفيناء</p>
            </div >
        </div >
    );
}
