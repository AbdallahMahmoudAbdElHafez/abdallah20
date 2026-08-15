const fs = require('fs');
let c = fs.readFileSync('src/services/salesReturns.service.js', 'utf8');
c = c.replaceAll('{ association: "employee" }', '{ association: "employee" },\n                { association: "warehouse" }');
fs.writeFileSync('src/services/salesReturns.service.js', c);
console.log('Done');
