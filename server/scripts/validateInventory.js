import { sequelize } from '../src/models/index.js';

async function validateInventory() {
  try {
    console.log("Starting inventory validation...");

    // 1. Sales Invoices
    const salesInvoiceErrors = await sequelize.query(`
      SELECT 
        sii.id AS item_id, 
        sii.sales_invoice_id, 
        si.invoice_status AS status, 
        sii.quantity AS document_quantity, 
        sii.bonus AS document_bonus,
        COALESCE(SUM(itb.quantity), 0) AS inventory_quantity
      FROM sales_invoice_items sii
      JOIN sales_invoices si ON si.id = sii.sales_invoice_id
      LEFT JOIN inventory_transactions it ON it.source_type = 'sales_invoice' AND it.source_id = sii.id
      LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
      GROUP BY sii.id
      HAVING (si.invoice_status != 'draft' AND si.invoice_status != 'cancelled' AND COALESCE(SUM(itb.quantity), 0) != (sii.quantity + sii.bonus))
          OR (si.invoice_status IN ('draft', 'cancelled') AND COALESCE(SUM(itb.quantity), 0) != 0)
    `, { type: sequelize.QueryTypes.SELECT });

    console.log("Sales Invoice Errors:", salesInvoiceErrors.length);
    if (salesInvoiceErrors.length > 0) {
       const types = {};
       salesInvoiceErrors.forEach(e => {
         const type = (e.status === 'draft' || e.status === 'cancelled') ? 'Draft/Cancelled with Inventory' : 'Missing/Mismatch Inventory';
         types[type] = (types[type] || 0) + 1;
       });
       console.log("Types:", types);
       console.log("Samples:", salesInvoiceErrors.slice(0, 3));
    }

    // 2. Sales Returns
    const salesReturnErrors = await sequelize.query(`
      SELECT 
        sri.id AS item_id, 
        sri.sales_return_id, 
        sr.status, 
        sri.quantity AS document_quantity, 
        COALESCE(SUM(itb.quantity), 0) AS inventory_quantity
      FROM sales_return_items sri
      JOIN sales_returns sr ON sr.id = sri.sales_return_id
      LEFT JOIN inventory_transactions it ON it.source_type = 'sales_return' AND it.source_id = sri.id
      LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
      GROUP BY sri.id
      HAVING (sr.status != 'draft' AND sr.status != 'cancelled' AND COALESCE(SUM(itb.quantity), 0) != sri.quantity)
          OR (sr.status IN ('draft', 'cancelled') AND COALESCE(SUM(itb.quantity), 0) != 0)
    `, { type: sequelize.QueryTypes.SELECT });

    console.log("Sales Return Errors:", salesReturnErrors.length);
    if (salesReturnErrors.length > 0) {
       const types = {};
       salesReturnErrors.forEach(e => {
         const type = (e.status === 'draft' || e.status === 'cancelled') ? 'Draft/Cancelled with Inventory' : 'Missing/Mismatch Inventory';
         types[type] = (types[type] || 0) + 1;
       });
       console.log("Types:", types);
    }

    // 3. Issue Vouchers
    const issueVoucherErrors = await sequelize.query(`
      SELECT 
        ivi.id AS item_id, 
        ivi.voucher_id, 
        iv.status, 
        ivi.quantity AS document_quantity, 
        COALESCE(SUM(itb.quantity), 0) AS inventory_quantity
      FROM issue_voucher_items ivi
      JOIN issue_vouchers iv ON iv.id = ivi.voucher_id
      LEFT JOIN inventory_transactions it ON it.source_type = 'issue_voucher' AND it.source_id = ivi.id
      LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
      GROUP BY ivi.id
      HAVING (iv.status != 'draft' AND iv.status != 'cancelled' AND COALESCE(SUM(itb.quantity), 0) != ivi.quantity)
          OR (iv.status IN ('draft', 'cancelled') AND COALESCE(SUM(itb.quantity), 0) != 0)
    `, { type: sequelize.QueryTypes.SELECT });

    console.log("Issue Voucher Errors:", issueVoucherErrors.length);
    if (issueVoucherErrors.length > 0) {
       const types = {};
       issueVoucherErrors.forEach(e => {
         const type = (e.status === 'draft' || e.status === 'cancelled') ? 'Draft/Cancelled with Inventory' : 'Missing/Mismatch Inventory';
         types[type] = (types[type] || 0) + 1;
       });
       console.log("Types:", types);
       console.log("Samples:", issueVoucherErrors.slice(0, 3));
    }

    // 4. Issue Voucher Returns
    const issueVoucherReturnErrors = await sequelize.query(`
      SELECT 
        ivri.id AS item_id, 
        ivri.return_id, 
        ivr.status, 
        ivri.quantity AS document_quantity, 
        COALESCE(SUM(itb.quantity), 0) AS inventory_quantity
      FROM issue_voucher_return_items ivri
      JOIN issue_voucher_returns ivr ON ivr.id = ivri.return_id
      LEFT JOIN inventory_transactions it ON it.source_type = 'issue_voucher_return' AND it.source_id = ivri.id
      LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
      GROUP BY ivri.id
      HAVING (ivr.status != 'draft' AND ivr.status != 'cancelled' AND COALESCE(SUM(itb.quantity), 0) != ivri.quantity)
          OR (ivr.status IN ('draft', 'cancelled') AND COALESCE(SUM(itb.quantity), 0) != 0)
    `, { type: sequelize.QueryTypes.SELECT });

    console.log("Issue Voucher Return Errors:", issueVoucherReturnErrors.length);
    if (issueVoucherReturnErrors.length > 0) {
       const types = {};
       issueVoucherReturnErrors.forEach(e => {
         const type = (e.status === 'draft' || e.status === 'cancelled') ? 'Draft/Cancelled with Inventory' : 'Missing/Mismatch Inventory';
         types[type] = (types[type] || 0) + 1;
       });
       console.log("Types:", types);
    }

  } catch (error) {
    console.error("Error during validation:", error);
  } finally {
    await sequelize.close();
  }
}

validateInventory();
