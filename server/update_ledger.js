import fs from 'fs';

let c = fs.readFileSync('src/services/customerLedger.service.js', 'utf8');

c = c.replace(
  /where: \{\s*party_id: customerId,\s*\.\.\.\(Object.keys\(dateFilter\)\.length \? \{ return_date: dateFilter \} : \{\}\),\s*\}/g,
  "where: {\n            party_id: customerId,\n            ...(Object.keys(dateFilter).length ? { return_date: dateFilter } : {}),\n            status: { [Op.ne]: 'cancelled' }\n        }"
);

c = c.replace(
  /where: \{\s*party_id: customerId,\s*return_date: \{ \[Op.lt\]: from \},\s*return_type: \{ \[Op.in\]: \['credit', 'exchange'\] \} \/\/ Both affect balance\s*\}/g,
  "where: {\n                party_id: customerId,\n                return_date: { [Op.lt]: from },\n                return_type: { [Op.in]: ['credit', 'exchange'] },\n                status: { [Op.ne]: 'cancelled' }\n            }"
);

c = c.replace(
  /where: \{\s*party_id: customerId,\s*return_date: \{ \[Op.lt\]: from \},\s*return_type: \{ \[Op.in\]: \['credit', 'exchange'\] \}\s*\}/g,
  "where: {\n                party_id: customerId,\n                return_date: { [Op.lt]: from },\n                return_type: { [Op.in]: ['credit', 'exchange'] },\n                status: { [Op.ne]: 'cancelled' }\n            }"
);

fs.writeFileSync('src/services/customerLedger.service.js', c);
