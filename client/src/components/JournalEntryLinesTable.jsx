import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialReactTable } from "material-react-table";
import { Button, Snackbar, Alert, Box } from "@mui/material";
import { fetchJournalEntryLines } from "../features/journalEntryLines/journalEntryLinesSlice";
import ManualJournalEntryDialog from "./ManualJournalEntryDialog";
import { defaultTableProps } from "../config/tableConfig";

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

  const columns = useMemo(
    () => [
      { header: "رقم القيد", accessorKey: "journal_entry_id" },
      {
        header: "تاريخ القيد",
        accessorFn: (row) => row.journal_entry?.entry_date,
        Cell: ({ cell }) => cell.getValue() || "-"
      },
      {
        header: "نوع القيد",
        accessorFn: (row) => row.journal_entry?.entry_type?.name,
        Cell: ({ cell }) => cell.getValue() || "-"
      },
      {
        header: "وصف القيد",
        accessorFn: (row) => row.journal_entry?.description,
        Cell: ({ cell }) => cell.getValue() || "-"
      },
      {
        header: "الحساب",
        accessorFn: (row) => row.Account?.name,
        Cell: ({ cell }) => cell.getValue() || "-"
      },
      { header: "مدين", accessorKey: "debit" },
      { header: "دائن", accessorKey: "credit" },
      { header: "الوصف", accessorKey: "description" },
    ],
    []
  );

  return (
    <Box p={4} sx={{ direction: "rtl" }}>
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpenManualDialog(true)}
        color="primary"
      >
        إنشاء قيد يدوي كامل
      </Button>

      <MaterialReactTable
        {...defaultTableProps}
        columns={columns}
        data={lines}
        state={{ isLoading: loading }}
        enablePagination
        enableSorting
        enableGlobalFilter
      />

      {/* Manual Journal Entry Dialog */}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
