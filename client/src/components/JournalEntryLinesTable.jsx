import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Button, Snackbar, Alert, Box, Typography, Paper, Tooltip, IconButton } from "@mui/material";
import * as XLSX from "xlsx";
import { fetchJournalEntryLines } from "../features/journalEntryLines/journalEntryLinesSlice";
import ManualJournalEntryDialog from "./ManualJournalEntryDialog";
import { defaultTableProps } from "../config/tableConfig";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import "./JournalEntryLinesTable.css";

export const JournalEntryLinesTable = () => {
  const dispatch = useDispatch();
  const { lines, loading } = useSelector((state) => state.journalEntryLines);

  const [openManualDialog, setOpenManualDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchJournalEntryLines());
  }, [dispatch]);

  const handleExportExcel = () => {
    const dataToExport = lines.map((row) => ({
      "رقم القيد": row.journal_entry_id,
      "تاريخ القيد": row.journal_entry?.entry_date || "-",
      "نوع القيد": row.journal_entry?.entry_type?.name || "-",
      "وصف القيد": row.journal_entry?.description || "-",
      "الحساب": row.Account?.name || "-",
      "مدين": Number(row.debit) || 0,
      "دائن": Number(row.credit) || 0,
      "الوصف": row.description
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "القيود");
    XLSX.writeFile(workbook, "JournalEntries.xlsx");
  };

  const normalizeArabic = (text = '') =>
    text
      .toString()
      .toLowerCase()
      .replace(/[إأآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/[\u064B-\u065F]/g, '');

  const arabicFilterFn = (row, columnId, filterValue) => {
    const rowValue = normalizeArabic(row.getValue(columnId));
    const filter = normalizeArabic(filterValue);
    return rowValue.includes(filter);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === 0) return "-";
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const columns = useMemo(
    () => [
      {
        header: "رقم القيد",
        accessorKey: "journal_entry_id",
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
            #{cell.getValue()}
          </Typography>
        )
      },
      {
        header: "تاريخ القيد",
        accessorFn: (row) => row.journal_entry?.entry_date,
        Cell: ({ cell }) => cell.getValue() || "-",
        size: 120,
      },
      {
        header: "نوع القيد",
        accessorFn: (row) => row.journal_entry?.entry_type?.name,
        Cell: ({ cell }) => (
          <Box sx={{
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            px: 1.5, py: 0.5,
            borderRadius: '20px',
            display: 'inline-block',
            fontSize: '0.85rem',
            color: '#1976d2',
            fontWeight: 500
          }}>
            {cell.getValue() || "-"}
          </Box>
        ),
        filterFn: arabicFilterFn,
        size: 150,
      },
      {
        header: "الحساب",
        accessorFn: (row) => row.Account?.name,
        Cell: ({ cell }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {cell.getValue() || "-"}
          </Typography>
        ),
        size: 200,
      },
      {
        header: "مدين",
        accessorKey: "debit",
        Cell: ({ cell }) => (
          <span className={cell.getValue() > 0 ? "debit-cell currency-text" : "currency-text"}>
            {formatCurrency(cell.getValue())}
          </span>
        ),
        size: 120,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        header: "دائن",
        accessorKey: "credit",
        Cell: ({ cell }) => (
          <span className={cell.getValue() > 0 ? "credit-cell currency-text" : "currency-text"}>
            {formatCurrency(cell.getValue())}
          </span>
        ),
        size: 120,
        muiTableHeadCellProps: { align: 'center' },
        muiTableBodyCellProps: { align: 'center' },
      },
      {
        header: "الوصف",
        accessorKey: "description",
        Cell: ({ cell }) => (
          <Tooltip title={cell.getValue() || ""}>
            <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
              {cell.getValue() || "-"}
            </Typography>
          </Tooltip>
        )
      },
    ],
    []
  );

  return (
    <Box className="journal-table-container">
      <Paper className="journal-header" elevation={0}>
        <Box className="journal-title">
          <ReceiptLongIcon sx={{ color: '#1976d2', fontSize: 32 }} />
          <Typography variant="h5" component="h1">
            دفتر اليومية التفصيلي
          </Typography>
        </Box>
        <Box className="journal-actions">
          <Button
            variant="contained"
            className="action-button"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setOpenManualDialog(true)}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            إنشاء قيد يدوي
          </Button>
          <Button
            variant="outlined"
            className="action-button"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportExcel}
            color="success"
          >
            تصدير Excel
          </Button>
        </Box>
      </Paper>

      <Paper className="table-paper" elevation={0}>
        <MaterialReactTable
          {...defaultTableProps}
          columns={columns}
          data={lines}
          state={{ isLoading: loading }}
          enablePagination
          enableSorting
          enableGlobalFilter
          muiTablePaperProps={{ elevation: 0 }}
          muiTableContainerProps={{ sx: { maxHeight: 'calc(100vh - 300px)' } }}
        />
      </Paper>

      <ManualJournalEntryDialog
        open={openManualDialog}
        onClose={() => setOpenManualDialog(false)}
        onSuccess={() => {
          dispatch(fetchJournalEntryLines());
          setSnackbar({
            open: true,
            message: "تم إنشاء القيد اليدوي بنجاح!",
            severity: "success",
          });
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

