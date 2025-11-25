import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenseCategories,
  addExpenseCategory,
  editExpenseCategory,
  removeExpenseCategory,
} from "../features/expenseCategories/expenseCategoriesSlice";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";

export default function ExpenseCategoryPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.expenseCategories);

  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    dispatch(fetchExpenseCategories());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "اسم التصنيف",
        size: 250,
      },
    ],
    []
  );

  // فتح نافذة إضافة
  const handleOpen = () => {
    setOpen(true);
    setNewName("");
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    dispatch(addExpenseCategory({ name: newName }));
    setOpen(false);
  };

  return (
    <Box p={3}>
      <MaterialReactTable
        columns={columns}
        data={items}
        state={{ isLoading: loading }}
        enableEditing
        enableColumnOrdering
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              size="small"
              onClick={() =>
                dispatch(
                  editExpenseCategory({
                    id: row.original.id,
                    category: { name: prompt("تعديل الاسم:", row.original.name) },
                  })
                )
              }
            >
              تعديل
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => dispatch(removeExpenseCategory(row.original.id))}
            >
              حذف
            </Button>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button variant="contained" onClick={handleOpen}>
            إضافة تصنيف
          </Button>
        )}
      />

      {/* Dialog لإضافة عنصر جديد */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>إضافة تصنيف جديد</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="اسم التصنيف"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
