CREATE DEFINER=`root`@`localhost` TRIGGER `trg_after_insert_sales_return` AFTER INSERT ON `sales_returns` FOR EACH ROW BEGIN
    DECLARE entry_id INT;
    DECLARE sales_account INT;
    DECLARE receivable_account INT;
    DECLARE tax_account INT;
    DECLARE total_amount DECIMAL(10,2) DEFAULT 0.00;
    DECLARE tax_amount DECIMAL(10,2) DEFAULT 0.00;

    
    SELECT 
        IFNULL(SUM(quantity * price), 0),
        IFNULL(SUM(quantity * price * (tax_rate / 100)), 0)
    INTO
        total_amount,
        tax_amount
    FROM sales_return_items
    WHERE return_id = NEW.id;

    
    SELECT 
        sales_revenue_account_id,
        receivables_account_id,
        tax_account_id
    INTO 
        sales_account,
        receivable_account,
        tax_account
    FROM accounting_settings
    WHERE id = 1;

    
    INSERT INTO journal_entries (entry_date, description)
    VALUES (NEW.return_date, CONCAT('مرتجع بيع #', NEW.id));
    SET entry_id = LAST_INSERT_ID();

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, receivable_account, 0, total_amount + tax_amount, 'إلغاء مديونية العميل');

    
    INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
    VALUES (entry_id, sales_account, total_amount, 0, 'إلغاء إيرادات المبيعات');

    
    IF tax_amount > 0 THEN
        INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description)
        VALUES (entry_id, tax_account, tax_amount, 0, 'عكس ضريبة المبيعات');
    END IF;
END