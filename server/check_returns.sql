-- Check latest sales returns
SELECT 'SALES RETURNS:' as section;
SELECT id, return_date, party_id, total_amount FROM sales_returns ORDER BY id DESC LIMIT 5;

-- Check sales return items
SELECT 'SALES RETURN ITEMS:' as section;
SELECT id, sales_return_id, product_id, quantity, return_condition FROM sales_return_items ORDER BY id DESC LIMIT 10;

-- Check journal entries for sales returns
SELECT 'JOURNAL ENTRIES:' as section;
SELECT je.id, je.entry_date, je.description, je.reference_id, rt.code as ref_type
FROM journal_entries je 
LEFT JOIN reference_types rt ON je.reference_type_id = rt.id 
WHERE rt.code = 'sales_return' 
ORDER BY je.id DESC LIMIT 10;

-- Check journal entry lines for recent entries
SELECT 'JOURNAL ENTRY LINES (Last 3 JEs):' as section;
SELECT jel.journal_entry_id as je_id, jel.account_id, a.name as account_name, jel.debit, jel.credit, jel.description
FROM journal_entry_lines jel
LEFT JOIN accounts a ON jel.account_id = a.id
WHERE jel.journal_entry_id IN (SELECT id FROM journal_entries ORDER BY id DESC LIMIT 3)
ORDER BY jel.journal_entry_id DESC, jel.id;
