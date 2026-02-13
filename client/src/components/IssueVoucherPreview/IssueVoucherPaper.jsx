import React from 'react';
import '../InvoicePreview/InvoicePreview.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

export default function IssueVoucherPaper({ voucher, company }) {
    if (!voucher) return null;

    const items = voucher.items || [];
    const partyName = voucher.party?.name || "غير محدد";
    const warehouseName = voucher.warehouse?.name || "غير محدد";
    const employeeName = voucher.responsible_employee?.name || "غير محدد";

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
                        {company?.phone && <span>هاتف: {company.phone}</span>}<br />
                        {company?.email && <span>البريد الإلكتروني: {company.email}</span>}
                    </div>
                </div>
                <div className="inv-meta">
                    <div className="inv-meta-row">
                        <span className="inv-label">رقم الإذن:</span>
                        <span>{voucher.voucher_no}</span>
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">التاريخ:</span>
                        <span>{voucher.issue_date}</span>
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">الحالة:</span>
                        <span style={{ textTransform: 'uppercase' }}>
                            {voucher.status === 'approved' ? 'معتمد' :
                                voucher.status === 'posted' ? 'مرحل' :
                                    voucher.status === 'cancelled' ? 'ملغي' : 'مسودة'}
                        </span>
                    </div>
                </div>
            </div >

            {/* Bill To Info Area (Used for Employee/Party) */}
            <div className="inv-addresses">
                <div className="inv-addr-block">
                    <div className="inv-addr-title">بيانات الاستلام</div>
                    <div className="inv-meta-row">
                        <span className="inv-label">الموظف المستلم:</span>
                        <strong>{employeeName}</strong>
                    </div>
                    <div className="inv-meta-row" style={{ marginTop: '5px' }}>
                        <span className="inv-label">الجهة/العميل:</span>
                        <span>{partyName}</span>
                    </div>
                </div>
                <div className="inv-addr-block">
                    <div className="inv-addr-title">بيانات المخزن</div>
                    <div className="inv-meta-row">
                        <span className="inv-label">المخزن:</span>
                        <strong>{warehouseName}</strong>
                    </div>
                </div>
            </div >

            {/* Items Table */}
            <table className="inv-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>اسم المنتج</th>
                        <th>الكمية</th>
                        <th>الوحدة</th>
                        <th>متوسط التكلفة</th>
                        <th>إجمالي التكلفة</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const qty = Number(item.quantity) || 0;
                        const unitCost = Number(item.cost_per_unit || item.product?.cost_price || 0);
                        const totalItemCost = qty * unitCost;

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: 'right' }}>{item.product?.name || "منتج غير معروف"}</td>
                                <td>{qty}</td>
                                <td>{item.product?.unit?.name || "-"}</td>
                                <td>{formatCurrency(unitCost)}</td>
                                <td>{formatCurrency(totalItemCost)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table >

            {/* Totals */}
            <div className="inv-totals" style={{ marginTop: '20px' }}>
                <div className="inv-totals-box">
                    <div className="inv-total-row final">
                        <span>إجمالي تكلفة الإذن:</span>
                        <span>{formatCurrency(voucher.total_cost || items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.cost_per_unit || item.product?.cost_price || 0)), 0))}</span>
                    </div>
                </div>
            </div >

            {voucher.note && (
                <div className="inv-notes" style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <div className="inv-label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>ملاحظات:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{voucher.note}</div>
                </div>
            )}

            {/* Signatures Area (Professional Touch) */}
            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>أمين المخزن</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>المستلم</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>الاعتماد</div>
                </div>
            </div>

            {/* Footer */}
            <div className="inv-footer">
                <p>نظام نوريفيناء - إدارة المخازن</p>
                <p>تم استخراج هذا الإذن آلياً بتاريخ {new Date().toLocaleDateString('ar-EG')}</p>
            </div >
        </div >
    );
}
