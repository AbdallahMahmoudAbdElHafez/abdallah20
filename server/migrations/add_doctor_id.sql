-- Migration to add doctor_id field to expenses and issue_vouchers tables
-- Run this script on your database

-- Add doctor_id to expenses table
ALTER TABLE expenses 
ADD COLUMN doctor_id INT NULL AFTER employee_id,
ADD INDEX idx_doctor_id (doctor_id);

-- Add doctor_id to issue_vouchers table
ALTER TABLE issue_vouchers 
ADD COLUMN doctor_id INT NULL AFTER employee_id;

-- Verify changes
DESCRIBE expenses;
DESCRIBE issue_vouchers;
