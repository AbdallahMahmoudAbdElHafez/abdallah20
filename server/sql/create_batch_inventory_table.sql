-- Create batch_inventory table to track quantities per batch per warehouse
CREATE TABLE IF NOT EXISTS batch_inventory (
  batch_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (batch_id, warehouse_id),
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  CHECK (quantity >= 0)
);

-- Create index for faster lookups
CREATE INDEX idx_batch_inventory_warehouse ON batch_inventory(warehouse_id);
CREATE INDEX idx_batch_inventory_batch ON batch_inventory(batch_id);
