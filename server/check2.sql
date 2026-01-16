-- Check if there are journal entries with sales_return reference type
SELECT COUNT(*) as je_count 
FROM journal_entries je 
INNER JOIN reference_types rt ON je.reference_type_id = rt.id 
WHERE rt.code = 'sales_return';
