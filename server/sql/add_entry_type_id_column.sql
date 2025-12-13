-- Add entry_type_id column to journal_entries table
ALTER TABLE `journal_entries` 
ADD COLUMN `entry_type_id` INT NOT NULL DEFAULT 1 
AFTER `reference_id`;

-- Add foreign key constraint
ALTER TABLE `journal_entries`
ADD CONSTRAINT `fk_journal_entry_type`
FOREIGN KEY (`entry_type_id`) 
REFERENCES `entry_types` (`id`)
ON DELETE RESTRICT
ON UPDATE CASCADE;
