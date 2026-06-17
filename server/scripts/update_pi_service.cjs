const fs = require('fs');

const path = 'src/services/purchaseInvoices.service.js';
let content = fs.readFileSync(path, 'utf8');

// --- 1. Modify create inventory cost calculation ---
content = content.replace(
`        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;

        for (const item of itemsWithInvoiceId) {
          // 1. Transaction for Main Quantity
          if (Number(item.quantity) > 0) {
            const batches = [];`,
`        const InventoryTransactionService = (await import('./inventoryTransaction.service.js')).default;

        const subtotal = Number(invoiceData.subtotal) || 0;
        const transportationCost = Number(invoiceData.transportation_cost) || 0;

        for (const item of itemsWithInvoiceId) {
          let finalCostPerUnit = Number(item.unit_price);
          if (transportationCost > 0 && Number(item.quantity) > 0) {
             const itemTotal = Number(item.quantity) * Number(item.unit_price) - Number(item.discount || 0);
             const allocatedTransport = subtotal > 0 ? (itemTotal / subtotal) * transportationCost : (transportationCost / itemsWithInvoiceId.length);
             finalCostPerUnit = finalCostPerUnit + (allocatedTransport / Number(item.quantity));
          }

          // 1. Transaction for Main Quantity
          if (Number(item.quantity) > 0) {
            const batches = [];`
);

content = content.replace(
`                cost_per_unit: Number(item.unit_price)
              });
            } else {
              batches.push({
                batch_number: null,
                expiry_date: null,
                quantity: item.quantity,
                cost_per_unit: Number(item.unit_price)`,
`                cost_per_unit: finalCostPerUnit
              });
            } else {
              batches.push({
                batch_number: null,
                expiry_date: null,
                quantity: item.quantity,
                cost_per_unit: finalCostPerUnit`
);

// --- 2. Modify update inventory cost calculation ---
content = content.replace(
`      if (invoiceType !== 'opening' && items !== undefined && items.length > 0) {
        for (const itemData of items) {
          const newItem = await PurchaseInvoiceItem.create({ ...itemData, purchase_invoice_id: id }, { transaction });

          if (Number(newItem.quantity) > 0) {
            const batches = newItem.batch_number && newItem.expiry_date ?
              [{ batch_number: newItem.batch_number, expiry_date: newItem.expiry_date, quantity: newItem.quantity, cost_per_unit: Number(newItem.unit_price) }] :
              [{ batch_number: null, expiry_date: null, quantity: newItem.quantity, cost_per_unit: Number(newItem.unit_price) }];`,
`      if (invoiceType !== 'opening' && items !== undefined && items.length > 0) {
        const subtotal = Number(invoiceData.subtotal) || Number(invoice.subtotal) || 0;
        const transportationCost = Number(invoiceData.transportation_cost) || Number(invoice.transportation_cost) || 0;

        for (const itemData of items) {
          const newItem = await PurchaseInvoiceItem.create({ ...itemData, purchase_invoice_id: id }, { transaction });

          let finalCostPerUnit = Number(newItem.unit_price);
          if (transportationCost > 0 && Number(newItem.quantity) > 0) {
             const itemTotal = Number(newItem.quantity) * Number(newItem.unit_price) - Number(newItem.discount || 0);
             const allocatedTransport = subtotal > 0 ? (itemTotal / subtotal) * transportationCost : (transportationCost / items.length);
             finalCostPerUnit = finalCostPerUnit + (allocatedTransport / Number(newItem.quantity));
          }

          if (Number(newItem.quantity) > 0) {
            const batches = newItem.batch_number && newItem.expiry_date ?
              [{ batch_number: newItem.batch_number, expiry_date: newItem.expiry_date, quantity: newItem.quantity, cost_per_unit: finalCostPerUnit }] :
              [{ batch_number: null, expiry_date: null, quantity: newItem.quantity, cost_per_unit: finalCostPerUnit }];`
);

// --- 3. Modify create JE logic ---
content = content.replace(
`          // Group subtotal by product type
          const subtotalByType = {};
          for (const item of items) {
            const productId = parseInt(item.product_id);
            const product = productMap.get(productId);
            const typeId = product?.type_id || null;
            const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

            // Calculate item total from quantity * unit_price
            const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);

            if (!subtotalByType[accountId]) {
              subtotalByType[accountId] = 0;
            }
            subtotalByType[accountId] += itemTotal;
          }`,
`          // Group subtotal by product type
          const subtotalByType = {};
          const subtotalVal = Number(invoiceData.subtotal) || 0;
          const transportationCost = Number(invoiceData.transportation_cost) || 0;

          for (const item of items) {
            const productId = parseInt(item.product_id);
            const product = productMap.get(productId);
            const typeId = product?.type_id || null;
            const accountId = PRODUCT_TYPE_TO_ACCOUNT[typeId] || INVENTORY_ACCOUNTS.DEFAULT;

            const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0) - parseFloat(item.discount || 0);
            const allocatedTransport = (subtotalVal > 0) ? (itemTotal / subtotalVal) * transportationCost : (transportationCost / items.length);

            if (!subtotalByType[accountId]) {
              subtotalByType[accountId] = 0;
            }
            subtotalByType[accountId] += itemTotal + allocatedTransport;
          }`
);

content = content.replace(
`            lines.push({
              account_id: supplierAccountId,
              debit: 0,
              credit: invoice.total_amount,
              description: \`Supplier - PI #\${invoice.invoice_number}\`
            });
          }`,
`            lines.push({
              account_id: supplierAccountId,
              debit: 0,
              credit: invoice.total_amount,
              description: \`Supplier - PI #\${invoice.invoice_number}\`
            });
          }

          // 6. Cr Transportation Account
          if (transportationCost > 0) {
            const transportAccountId = invoiceData.transportation_account_id || 1; // fallback
            lines.push({
              account_id: parseInt(transportAccountId),
              debit: 0,
              credit: transportationCost,
              description: \`Transportation - PI #\${invoice.invoice_number}\`
            });
          }`
);

// --- 4. Modify update JE logic ---
content = content.replace(
`          const subtotalByType = {};
          for (const item of currentItems) {
            const product = productMap.get(item.product_id);
            const accountId = INVENTORY_ACCOUNTS[product?.type_id] || INVENTORY_ACCOUNTS.DEFAULT;
            const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
            subtotalByType[accountId] = (subtotalByType[accountId] || 0) + itemTotal;
          }`,
`          const subtotalByType = {};
          const subtotalVal = Number(invoice.subtotal) || 0;
          const transportationCost = Number(invoice.transportation_cost) || 0;

          for (const item of currentItems) {
            const product = productMap.get(item.product_id);
            const accountId = INVENTORY_ACCOUNTS[product?.type_id] || INVENTORY_ACCOUNTS.DEFAULT;
            const itemTotal = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0) - parseFloat(item.discount || 0);
            const allocatedTransport = (subtotalVal > 0) ? (itemTotal / subtotalVal) * transportationCost : (transportationCost / currentItems.length);
            subtotalByType[accountId] = (subtotalByType[accountId] || 0) + itemTotal + allocatedTransport;
          }`
);

content = content.replace(
`          lines.push({ account_id: supplier?.account_id || supplierAccount.id, debit: 0, credit: invoice.total_amount, description: \`Supplier - PI #\${invoice.invoice_number}\` });

          if (lines.length > 0) {`,
`          lines.push({ account_id: supplier?.account_id || supplierAccount.id, debit: 0, credit: invoice.total_amount, description: \`Supplier - PI #\${invoice.invoice_number}\` });
          
          if (transportationCost > 0) {
            const transportAccountId = invoice.transportation_account_id || 1;
            lines.push({ account_id: parseInt(transportAccountId), debit: 0, credit: transportationCost, description: \`Transportation - PI #\${invoice.invoice_number}\` });
          }

          if (lines.length > 0) {`
);

fs.writeFileSync(path, content, 'utf8');
console.log('purchaseInvoices.service.js updated successfully.');
