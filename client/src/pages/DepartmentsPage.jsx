import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../features/departments/departmentsSlice";

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.departments);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (editData) {
      dispatch(updateDepartment({ id: editData.id, data: { name } }));
    } else {
      dispatch(addDepartment({ name }));
    }

    setOpen(false);
    setEditData(null);
    setName("");
  };

  const handleEdit = (dept) => {
    setEditData(dept);
    setName(dept.name);
    setOpen(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteDepartment(id));
  };

  return (
    <div className="p-4">
      <Button variant="contained" onClick={() => setOpen(true)}>
        إضافة قسم
      </Button>

      <Table className="mt-4">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>الاسم</TableCell>
            <TableCell>عمليات</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {list.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>{dept.id}</TableCell>
              <TableCell>{dept.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(dept)}>تعديل</Button>
                <Button color="error" onClick={() => handleDelete(dept.id)}>
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editData ? "تعديل القسم" : "إضافة قسم"}</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="اسم القسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSave}>
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
