-- Add crm_product_id to products and crm_user_id to employees
ALTER TABLE `products` ADD COLUMN `crm_product_id` INT NULL;
ALTER TABLE `employees` ADD COLUMN `crm_user_id` INT NULL;
