import React from 'react';
import '../InvoicePreview/InvoicePreview.css';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(amount || 0);
};

export default function WarehouseTransferPaper({ transfer, company }) {
    if (!transfer) return null;

    const items = transfer.items || [];
    const fromWarehouseName = transfer.fromWarehouse?.name || 'غير محدد';
    const toWarehouseName = transfer.toWarehouse?.name || 'غير محدد';

    const transferDate = transfer.transfer_date
        ? new Date(transfer.transfer_date).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        : '—';

    const grandTotal = items.reduce((sum, item) => {
        return sum + (Number(item.quantity || 0) * Number(item.cost_per_unit || 0));
    }, 0);

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
                    <div style={{
                        fontSize: '20px', fontWeight: 'bold', color: '#2c3e50',
                        marginBottom: '15px', textAlign: 'center',
                        border: '2px solid #2c3e50', padding: '8px 20px', borderRadius: '4px'
                    }}>
                        إذن تحويل مخزني
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">رقم التحويل:</span>
                        <span>{transfer.id}</span>
                    </div>
                    <div className="inv-meta-row">
                        <span className="inv-label">التاريخ:</span>
                        <span>{transferDate}</span>
                    </div>
                </div>
            </div>

            {/* Warehouse Info */}
            <div className="inv-addresses">
                <div className="inv-addr-block">
                    <div className="inv-addr-title">المخزن المصدر</div>
                    <div className="inv-meta-row">
                        <span className="inv-label">من مخزن:</span>
                        <strong>{fromWarehouseName}</strong>
                    </div>
                </div>
                <div className="inv-addr-block">
                    <div className="inv-addr-title">المخزن المستلم</div>
                    <div className="inv-meta-row">
                        <span className="inv-label">إلى مخزن:</span>
                        <strong>{toWarehouseName}</strong>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="inv-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>اسم المنتج</th>
                        <th>الكمية</th>
                        <th>تكلفة الوحدة</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const qty = Number(item.quantity) || 0;
                        const unitCost = Number(item.cost_per_unit) || 0;
                        const totalItemCost = qty * unitCost;

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {item.product?.name || item.product_name || 'منتج غير معروف'}
                                </td>
                                <td>{qty}</td>
                                <td>{formatCurrency(unitCost)}</td>
                                <td>{formatCurrency(totalItemCost)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Totals */}
            <div className="inv-totals" style={{ marginTop: '20px' }}>
                <div className="inv-totals-box">
                    <div className="inv-total-row">
                        <span>عدد الأصناف:</span>
                        <span>{items.length}</span>
                    </div>
                    <div className="inv-total-row">
                        <span>إجمالي الكميات:</span>
                        <span>{items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)}</span>
                    </div>
                    <div className="inv-total-row final">
                        <span>إجمالي التكلفة:</span>
                        <span>{formatCurrency(grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {transfer.note && (
                <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <div className="inv-label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>ملاحظات:</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{transfer.note}</div>
                </div>
            )}

            {/* Signatures */}
            <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>
                        أمين المخزن المصدر
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>
                        أمين المخزن المستلم
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '2px solid #333', width: '150px', paddingTop: '10px' }}>
                        الاعتماد
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="inv-footer">
                <p>نظام نوريفيناء - إدارة المخازن</p>
                <p>تم استخراج هذا الإذن آلياً بتاريخ {new Date().toLocaleDateString('ar-EG')}</p>
            </div>
        </div>
    );
}
