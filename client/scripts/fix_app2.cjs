const fs = require('fs');
const path = 'd:\\db\\client\\src\\App.jsx';
let content = fs.readFileSync(path, 'utf8');

// Count occurrences
const target = 'import BatchCustomerStatementsPage from "./pages/BatchCustomerStatementsPage";';
let count = 0;
let idx = 0;
while ((idx = content.indexOf(target, idx)) !== -1) {
    count++;
    idx += target.length;
}
console.log('Found', count, 'occurrences');

if (count > 1) {
    // Find second occurrence and remove it
    const firstIdx = content.indexOf(target);
    const secondIdx = content.indexOf(target, firstIdx + target.length);
    console.log('First at:', firstIdx, 'Second at:', secondIdx);
    
    // Remove from second occurrence to end of line (including newline)
    const beforeSecond = content.substring(0, secondIdx);
    const afterSecond = content.substring(secondIdx + target.length);
    // Remove the newline char too
    const newContent = beforeSecond + afterSecond.replace(/^\r?\n/, '');
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Done');
}
