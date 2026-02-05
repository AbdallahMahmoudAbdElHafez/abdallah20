// src/create_service_invoice_schema.js
// Migration script to create the new service invoice system tables
import { sequelize } from './models/index.js';

async function createServiceInvoiceSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();

        console.log("Starting service invoice schema migration...");

        // 1. Create service_types table
        console.log("Creating service_types table...");
        await queryInterface.createTable('service_types', {
            id: {
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: 'VARCHAR(100)',
                allowNull: false
            },
            account_id: {
                type: 'INTEGER',
                allowNull: true,
                references: {
                    model: 'accounts',
                    key: 'id'
                }
            },
            affects_job_cost: {
                type: 'BOOLEAN',
                defaultValue: true
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Insert default service types
        console.log("Inserting default service types...");
        await sequelize.query(`
            INSERT INTO service_types (name, affects_job_cost) VALUES
            ('تشغيل', TRUE),
            ('نقل', TRUE),
            ('معالجة', TRUE),
            ('أخرى', FALSE)
        `);

        // 2. Create external_service_invoices table
        console.log("Creating external_service_invoices table...");
        await queryInterface.createTable('external_service_invoices', {
            id: {
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            job_order_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'external_job_orders',
                    key: 'id'
                }
            },
            party_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'parties',
                    key: 'id'
                }
            },
            invoice_no: {
                type: 'VARCHAR(50)',
                allowNull: true
            },
            invoice_date: {
                type: 'DATE',
                allowNull: false
            },
            status: {
                type: "ENUM('Draft', 'Posted', 'Cancelled')",
                defaultValue: 'Draft'
            },
            sub_total: {
                type: 'DECIMAL(14, 2)',
                defaultValue: 0.00
            },
            tax_total: {
                type: 'DECIMAL(14, 2)',
                defaultValue: 0.00
            },
            total_amount: {
                type: 'DECIMAL(14, 2)',
                defaultValue: 0.00
            },
            notes: {
                type: 'TEXT',
                allowNull: true
            },
            journal_entry_id: {
                type: 'INTEGER',
                allowNull: true,
                references: {
                    model: 'journal_entries',
                    key: 'id'
                }
            },
            posted_at: {
                type: 'DATETIME',
                allowNull: true
            },
            posted_by: {
                type: 'INTEGER',
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            created_at: {
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // 3. Create external_service_invoice_items table
        console.log("Creating external_service_invoice_items table...");
        await queryInterface.createTable('external_service_invoice_items', {
            id: {
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            invoice_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'external_service_invoices',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            service_type_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'service_types',
                    key: 'id'
                }
            },
            description: {
                type: 'TEXT',
                allowNull: true
            },
            quantity: {
                type: 'DECIMAL(12, 3)',
                defaultValue: 1.000
            },
            unit_price: {
                type: 'DECIMAL(12, 2)',
                allowNull: false
            },
            line_total: {
                type: 'DECIMAL(14, 2)',
                allowNull: false
            }
        });

        // 4. Create external_service_invoice_item_taxes table
        console.log("Creating external_service_invoice_item_taxes table...");
        await queryInterface.createTable('external_service_invoice_item_taxes', {
            id: {
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            invoice_item_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'external_service_invoice_items',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            tax_name: {
                type: 'VARCHAR(50)',
                allowNull: false
            },
            tax_rate: {
                type: 'DECIMAL(5, 4)',
                allowNull: false
            },
            tax_amount: {
                type: 'DECIMAL(12, 2)',
                allowNull: false
            }
        });

        // 5. Create job_order_cost_transactions table
        console.log("Creating job_order_cost_transactions table...");
        await queryInterface.createTable('job_order_cost_transactions', {
            id: {
                type: 'INTEGER',
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            job_order_id: {
                type: 'INTEGER',
                allowNull: false,
                references: {
                    model: 'external_job_orders',
                    key: 'id'
                }
            },
            invoice_id: {
                type: 'INTEGER',
                allowNull: true,
                references: {
                    model: 'external_service_invoices',
                    key: 'id'
                }
            },
            cost_type: {
                type: "ENUM('Service', 'Transport', 'RawMaterial', 'Other')",
                allowNull: false
            },
            amount: {
                type: 'DECIMAL(14, 2)',
                allowNull: false
            },
            transaction_date: {
                type: 'DATETIME',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            notes: {
                type: 'TEXT',
                allowNull: true
            }
        });

        console.log("✅ Service invoice schema migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during migration:", error);
        process.exit(1);
    }
}

createServiceInvoiceSchema();
