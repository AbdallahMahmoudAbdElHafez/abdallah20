ALTER TABLE doctors 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- للتأكد من وجود جميع الحقول بالترتيب الصحيح (اختياري)
-- DESCRIBE doctors;
