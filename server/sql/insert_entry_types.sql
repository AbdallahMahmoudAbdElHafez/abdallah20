-- SQL script to add entry types to the database
-- Run this script to insert all 14 entry types

INSERT INTO entry_types (id, name) VALUES
(1, 'قيد افتتاحي'),
(2, 'قيد فاتورة مبيعات'),
(3, 'قيد تحصيل مبيعات'),
(4, 'قيد مرتجع مبيعات'),
(5, 'قيد فاتورة مشتريات'),
(6, 'قيد سداد مشتريات'),
(7, 'قيد مرتجع مشتريات'),
(8, 'قيد مصروف'),
(9, 'قيد إيراد'),
(10, 'قيد تسوية'),
(11, 'قيد إهلاك'),
(12, 'قيد تحويل مخزني'),
(13, 'قيد إنتاج / تصنيع'),
(14, 'قيد تعديل يدوي')
ON DUPLICATE KEY UPDATE name = VALUES(name);
