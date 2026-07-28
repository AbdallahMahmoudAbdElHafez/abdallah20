const fs = require('fs');
let content = fs.readFileSync('./src/models/index.js', 'utf8');
const search = `SalesReturnItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});`;
const replace = `SalesReturnItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product"
});

// SalesReturnItem ↔ InventoryTransaction (for batch info)
SalesReturnItem.hasMany(InventoryTransaction, {
  foreignKey: "source_id",
  constraints: false,
  scope: {
    source_type: "sales_return"
  },
  as: "inventory_transactions"
});
InventoryTransaction.belongsTo(SalesReturnItem, {
  foreignKey: "source_id",
  constraints: false,
  as: "sales_return_item"
});`;

// handle \r\n vs \n
let cleanSearch = search.replace(/\r\n/g, '\n');
content = content.replace(/\r\n/g, '\n');

if(content.includes(cleanSearch)) {
    content = content.replace(cleanSearch, replace);
    fs.writeFileSync('./src/models/index.js', content);
    console.log('Patch applied successfully.');
} else {
    console.log('Search string not found.');
}
