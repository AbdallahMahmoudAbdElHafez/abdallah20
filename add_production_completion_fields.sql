-- ============================================
-- Migration: Add Production Completion Fields
-- Date: 2025-12-07
-- Description: Add raw_material_cost and unit_cost to external_job_orders
-- ============================================

USE nurivina_db;

-- Add new columns
ALTER TABLE `external_job_orders` 
ADD COLUMN IF NOT EXISTS `raw_material_cost` DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Cost of raw materials consumed' AFTER `cost_actual`,
ADD COLUMN IF NOT EXISTS `unit_cost` DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Final cost per unit (materials + actual costs)' AFTER `raw_material_cost`;

-- Verify the changes
DESCRIBE `external_job_orders`;

SELECT 'Migration completed successfully!' AS Status;
