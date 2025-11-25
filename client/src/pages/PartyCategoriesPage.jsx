import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPartyCategories,
  addPartyCategory,
  updatePartyCategory,
  deletePartyCategory,
} from "../features/partyCategories/partyCategoriesSlice";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Breadcrumbs,
  Typography,
  Chip,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { Link } from "react-router-dom";

const PartyCategoriesPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.partyCategories);

  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    dispatch(fetchPartyCategories());
  }, [dispatch]);

  const handleOpen = (row = null) => {
    setEditingRow(row);
    setFormData(row ? { ...row } : { name: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
    setFormData({ name: "" });
  };

  const handleSubmit = () => {
    if (editingRow) {
      dispatch(updatePartyCategory({ id: editingRow.id, data: formData }));
    } else {
      dispatch(addPartyCategory(formData));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deletePartyCategory(id));
    }
  };

  const columns = [

    {
      accessorKey: "name",
      header: "التصنيفات",
      Cell: ({ cell }) => (
        <Chip label={cell.getValue()} color="primary" variant="outlined" />
      ),
    },
    {
      header: "الاجراءات",
      Cell: ({ row }) => (
        <Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleOpen(row.original)}
            sx={{ mr: 1 }}
          >
            تعديل
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleDelete(row.original.id)}
          >
            حذف
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box p={2}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link to="/">Home</Link>
        <Typography color="text.primary">تصنيفات العملاء</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">تصنيفات العملاء</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Category
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={items}
        state={{ isLoading: loading }}
        muiTableBodyCellProps={{
          sx: { fontSize: "14px" },
        }}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingRow ? "تعديل" : "اضافه"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="اسم التصنيف"
            fullWidth
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingRow ? "تعديل" : "اضافه"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartyCategoriesPage;
