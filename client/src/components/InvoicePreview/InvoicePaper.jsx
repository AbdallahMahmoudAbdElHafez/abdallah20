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

export default function InvoicePaper({ invoice, items, columns, type = 'sales', company, showPhone, isBonus = false }) {
    if (!invoice) return null;

    // Helper to check if col is visible
    const showCol = (key) => columns.find(c => c.key === key)?.visible;

    // Determine type specific labels
    const isSales = type === 'sales';
    const partyLabel = isSales ? 'العميل' : 'المورد';
    const partyName = invoice.party?.name || invoice.supplier?.name || "N/A";
    const partyAddress = invoice.party?.address || invoice.supplier?.address || "العنوان غير متوفر";
    const partyPhone = invoice.party?.phone || invoice.supplier?.phone || "";

    const invoiceTitle = isBonus ? "فاتورة بونص" : (isSales ? "فاتورة مبيعات" : "فاتورة مشتريات");
    const displayItems = isBonus ? items.filter(item => Number(item.bonus) > 0) : items;

    return (
        <div className="invoice-paper" dir="rtl">
            {/* Header */}
            <h2 style={{ textAlign: 'center', margin: '10px 0', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                {invoiceTitle}
            </h2>
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
                    {invoice.shipping_by && (
                        <div className="inv-meta-row">
                            <span className="inv-label">بواسطة:</span>
                            <span>{invoice.shipping_by}</span>
                        </div>
                    )}
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
                        {(!isBonus && showCol('product') || isBonus) && <th>المنتج</th>}
                        {(!isBonus && showCol('batch_number') || isBonus) && <th>رقم التشغيلة</th>}
                        {(!isBonus && showCol('expiry_date') || isBonus) && <th>تاريخ الصلاحية</th>}
                        {(!isBonus && showCol('quantity') || isBonus) && <th>الكمية</th>}
                        {!isBonus && showCol('bonus') && <th>بونص</th>}
                        {!isBonus && showCol('unit_price') && <th>السعر</th>}
                        {!isBonus && showCol('total_before_discount') && <th>الإجمالي قبل الخصم</th>}
                        {!isBonus && showCol('discount_percent') && <th>نسبة الخصم</th>}
                        {!isBonus && showCol('discount') && <th>قيمة الخصم</th>}
                        {!isBonus && showCol('tax') && <th>الضريبة</th>}
                        {!isBonus && showCol('total') && <th>الإجمالي</th>}
                    </tr>
                </thead>
                <tbody>
                    {displayItems.map((item, index) => {
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
                                {(!isBonus && showCol('product') || isBonus) && <td>{item.product_name || item.product?.name || item.Product?.name || "منتج غير معروف"}</td>}
                                {(!isBonus && showCol('batch_number') || isBonus) && <td>{item.inventory_transactions?.[0]?.transaction_batches?.[0]?.batch?.batch_number || item.batch_number || "-"}</td>}
                                {(!isBonus && showCol('expiry_date') || isBonus) && <td>{item.inventory_transactions?.[0]?.transaction_batches?.[0]?.batch?.expiry_date || item.expiry_date || "-"}</td>}
                                {(!isBonus && showCol('quantity') || isBonus) && <td>{isBonus ? bonus : qty}</td>}
                                {!isBonus && showCol('bonus') && <td>{bonus}</td>}
                                {!isBonus && showCol('unit_price') && <td>{formatCurrency(price)}</td>}
                                {!isBonus && showCol('total_before_discount') && <td>{formatCurrency(totalBeforeDiscount)}</td>}
                                {!isBonus && showCol('discount_percent') && <td>{discountPercent.toFixed(2)}%</td>}
                                {!isBonus && showCol('discount') && <td>{formatCurrency(discountVal)}</td>}
                                {!isBonus && showCol('tax') && <td>-</td>}
                                {!isBonus && showCol('total') && <td>{formatCurrency(lineTotal)}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table >

            {/* Totals */}
            {!isBonus && (
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
            )}

            {invoice.note && (
                <div className="inv-notes" style={{ marginTop: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <div className="inv-label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>ملاحظات:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{invoice.note}</div>
                </div>
            )}

            {/* Footer */}
            < div className="inv-footer" >
                <p>شكراً لتعاملكم معنا!</p>
                <p>صنعت بواسطة نظام نوريفيناء</p>
            </div >
        </div >
    );
}
