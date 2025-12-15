import { useEffect, useMemo, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../features/employees/employeesSlice";
import employeesApi from "../api/employeesApi";

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.employees);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [jobTitles, setJobTitles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    job_title_id: "",
    department_id: "",
    parent_id: null,
    phone: "",
    email: "",
    hire_date: "",
  });

  const loadLists = async () => {
    const jt = await employeesApi.getJobTitles();
    const dp = await employeesApi.getDepartments();
    const mg = await employeesApi.getManagers();

    setJobTitles(jt.data);
    setDepartments(dp.data);
    setManagers(mg.data);
  };

  useEffect(() => {
    dispatch(fetchEmployees());
    loadLists();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "الاسم" },
      { accessorKey: "job_title.title_name", header: "الوظيفة" },
      { accessorKey: "department.name", header: "القسم" },
      { accessorKey: "phone", header: "الهاتف" },
      { accessorKey: "email", header: "الإيميل" },
      { accessorKey: "hire_date", header: "تاريخ التعيين" },
    ],
    []
  );

  const validate = () => {
    if (!form.name.trim()) return "الاسم مطلوب";
    if (!form.job_title_id) return "اختر الوظيفة";
    if (!form.department_id) return "اختر القسم";
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    if (editData) {
      dispatch(updateEmployee({ id: editData.id, data: form }));
    } else {
      dispatch(addEmployee(form));
    }

    setOpen(false);
    setEditData(null);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      job_title_id: "",
      department_id: "",
      parent_id: null,
      phone: "",
      email: "",
      hire_date: "",
    });
  };

  return (
    <div className="p-4">

      <Button variant="contained" onClick={() => setOpen(true)}>
        إضافة موظف
      </Button>

      <MaterialReactTable
        columns={columns}
        {...defaultTableProps}
        data={list}
        enableRowActions
        renderRowActions={({ row }) => (
          <div>
            <Button
              onClick={() => {
                setEditData(row.original);
                setForm(row.original);
                setOpen(true);
              }}
            >
              تعديل
            </Button>
            <Button
              color="error"
              onClick={() => dispatch(deleteEmployee(row.original.id))}
            >
              حذف
            </Button>
          </div>
        )}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editData ? "تعديل موظف" : "إضافة موظف"}
        </DialogTitle>
        <DialogContent>

          <TextField
            fullWidth
            label="الاسم"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            margin="dense"
          />

          <TextField
            select
            fullWidth
            label="الوظيفة"
            value={form.job_title_id || ""}
            onChange={(e) =>
              setForm({ ...form, job_title_id: e.target.value })
            }
            margin="dense"
          >
            {jobTitles.map((j) => (
              <MenuItem key={j.id} value={j.id}>
                {j.title_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="القسم"
            value={form.department_id || ""}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
            margin="dense"
          >
            {departments.map((d) => (
              <MenuItem key={d.id} value={d.id}>
                {d.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="المدير المباشر"
            value={form.parent_id || ""}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            margin="dense"
          >
            <MenuItem value="">بدون</MenuItem>
            {managers.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="الهاتف"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            margin="dense"
          />

          <TextField
            fullWidth
            label="الإيميل"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            margin="dense"
          />

          <TextField
            type="date"
            fullWidth
            label="تاريخ التعيين"
            InputLabelProps={{ shrink: true }}
            value={form.hire_date}
            onChange={(e) =>
              setForm({ ...form, hire_date: e.target.value })
            }
            margin="dense"
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            حفظ
          </Button>

        </DialogContent>
      </Dialog>
    </div>
  );
}
