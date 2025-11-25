// src/pages/SupplierChequesPage.jsx
import React, { useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import { fetchCheques, deleteCheque } from "../features/supplierCheques/supplierChequesSlice";

export default function SupplierChequesPage() {
  const dispatch = useDispatch();
  const { items: cheques = [], status } = useSelector((s) => s.supplierCheques);

  useEffect(() => {
    dispatch(fetchCheques());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this cheque?")) {
      dispatch(deleteCheque(id));
    }
  };

  const columns = [
    { accessorKey: "cheque_number", header: "Cheque No." },
    { accessorKey: "supplier_name", header: "Supplier" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "issue_date", header: "Issue Date" },
    { accessorKey: "due_date", header: "Due Date" },
    { accessorKey: "status", header: "Status" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Button
          color="error"
          size="small"
          variant="outlined"
          onClick={() => handleDelete(row.original.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <MaterialReactTable columns={columns} data={cheques} />
    </Box>
  );
}
