-- Migration: Add unit_cost and raw_material_cost to external_job_orders table
-- Date: 2025-12-07

ALTER TABLE `external_job_orders` 
ADD COLUMN `raw_material_cost` DECIMAL(12,2) DEFAULT 0.00 AFTER `cost_actual`,
ADD COLUMN `unit_cost` DECIMAL(12,2) DEFAULT 0.00 AFTER `raw_material_cost`;
