import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobTitles,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle,
} from "../features/jobTitles/jobTitlesSlice";

import { MaterialReactTable } from "material-react-table";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function JobTitlesPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.jobTitles);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [titleName, setTitleName] = useState("");

  useEffect(() => {
    dispatch(fetchJobTitles());
  }, [dispatch]);

  const handleSave = () => {
    if (editId) {
      dispatch(updateJobTitle({ id: editId, data: { title_name: titleName } }));
    } else {
      dispatch(createJobTitle({ title_name: titleName }));
    }
    setOpen(false);
    setEditId(null);
    setTitleName("");
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setTitleName(row.title_name);
    setOpen(true);
  };

  const handleDelete = (row) => {
    dispatch(deleteJobTitle(row.id));
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "title_name", header: "Job Title" },
  ];

  return (
    <div className="p-5">
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Job Title
      </Button>

      <MaterialReactTable
        columns={columns}
        data={items}
        state={{ isLoading: loading }}
        enableRowActions
        renderRowActions={({ row }) => (
          <>
            <Button onClick={() => handleEdit(row.original)}>Edit</Button>
            <Button color="error" onClick={() => handleDelete(row.original)}>
              Delete
            </Button>
          </>
        )}
      />

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Job Title" : "Add Job Title"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Title Name"
            value={titleName}
            onChange={(e) => setTitleName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
