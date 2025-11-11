import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProcesses,
  addProcess,
  updateProcess,
  deleteProcess,
} from "../features/processes/processesSlice";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function ProcessesPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.processes);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchProcesses());
  }, [dispatch]);

  const handleOpen = (process = null) => {
    if (process) {
      setForm({ name: process.name, description: process.description || "" });
      setEditId(process.id);
    } else {
      setForm({ name: "", description: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ name: "", description: "" });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editId) {
      dispatch(updateProcess({ id: editId, data: form }));
    } else {
      dispatch(addProcess(form));
    }

    handleClose();
  };

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من الحذف؟")) dispatch(deleteProcess(id));
  };

  return (
    <Box p={4} maxWidth={900} mx="auto">
      <Typography variant="h5" fontWeight="bold" mb={3}>
        إدارة العمليات (Processes)
      </Typography>

      <Box mb={2}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          إضافة عملية جديدة
        </Button>
      </Box>

      {loading && <Typography>جاري التحميل...</Typography>}
      {error && <Typography color="error">حدث خطأ: {error}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>الاسم</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell align="center">إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleOpen(p)}
                      sx={{ mr: 1 }}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(p.id)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "تعديل العملية" : "إضافة عملية جديدة"}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
            mt={1}
          >
            <TextField
              label="اسم العملية"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              autoFocus
            />
            <TextField
              label="الوصف"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editId ? "تحديث" : "حفظ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
