
ALTER TABLE purchase_invoice_payments ADD COLUMN employee_id INT NULL, ADD CONSTRAINT fk_pip_employee FOREIGN KEY (employee_id) REFERENCES employees(id);
ALTER TABLE sales_invoice_payments ADD COLUMN employee_id INT NULL, ADD CONSTRAINT fk_sip_employee FOREIGN KEY (employee_id) REFERENCES employees(id);
ALTER TABLE service_payments ADD COLUMN employee_id INT NULL, ADD CONSTRAINT fk_sp_employee FOREIGN KEY (employee_id) REFERENCES employees(id);
