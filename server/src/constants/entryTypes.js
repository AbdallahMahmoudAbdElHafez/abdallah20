// Entry Type Constants for Journal Entries
export const ENTRY_TYPES = {
    OPENING: 1,                    // قيد افتتاحي
    SALES_INVOICE: 2,              // قيد فاتورة مبيعات
    SALES_COLLECTION: 3,           // قيد تحصيل مبيعات
    SALES_RETURN: 4,               // قيد مرتجع مبيعات
    PURCHASE_INVOICE: 5,           // قيد فاتورة مشتريات
    PURCHASE_PAYMENT: 6,           // قيد سداد مشتريات
    PURCHASE_RETURN: 7,            // قيد مرتجع مشتريات
    EXPENSE: 8,                    // قيد مصروف
    REVENUE: 9,                    // قيد إيراد
    ADJUSTMENT: 10,                // قيد تسوية
    DEPRECIATION: 11,              // قيد إهلاك
    WAREHOUSE_TRANSFER: 12,        // قيد تحويل مخزني
    MANUFACTURING: 13,             // قيد إنتاج / تصنيع
    MANUAL_ADJUSTMENT: 14,          // قيد تعديل يدوي
    INVENTORY_COUNT: 44,            // قيد جرد المخزون
    ISSUE_VOUCHER: 82              // قيد سند صرف
};

export default ENTRY_TYPES;
