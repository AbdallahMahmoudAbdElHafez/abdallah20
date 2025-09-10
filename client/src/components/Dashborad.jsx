import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnits, addUnit, deleteUnit, updateUnit } from "../features/units/unitsSlice";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import { Delete, Edit } from "@mui/icons-material";

export default function UnitsPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.units);

  const [newUnit, setNewUnit] = useState("");
  const [editUnit, setEditUnit] = useState(null);
  const [editName, setEditName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    dispatch(fetchUnits());
  }, [dispatch]);

  const handleAdd = () => {
    if (newUnit.trim()) {
      dispatch(addUnit({ name: newUnit }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Unit added!", severity: "success" }))
        .catch(() => setSnackbar({ open: true, message: "Failed to add unit", severity: "error" }));
      setNewUnit("");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteUnit(id))
      .unwrap()
      .then(() => setSnackbar({ open: true, message: "Unit deleted!", severity: "info" }))
      .catch(() => setSnackbar({ open: true, message: "Failed to delete unit", severity: "error" }));
  };

  const handleUpdate = () => {
    if (editUnit && editName.trim()) {
      dispatch(updateUnit({ id: editUnit.id, data: { name: editName } }))
        .unwrap()
        .then(() => setSnackbar({ open: true, message: "Unit updated!", severity: "success" }))
        .catch(() => setSnackbar({ open: true, message: "Failed to update unit", severity: "error" }));
      setEditUnit(null);
      setEditName("");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Units
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* إضافة وحدة جديدة */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Add new unit"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {/* جدول الوحدات */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell>{unit.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setEditUnit(unit);
                      setEditName(unit.name);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(unit.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog للتعديل */}
      <Dialog open={!!editUnit} onClose={() => setEditUnit(null)}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Unit name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUnit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
