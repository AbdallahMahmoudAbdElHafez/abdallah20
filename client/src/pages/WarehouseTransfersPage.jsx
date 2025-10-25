// src/pages/WarehouseTransfersPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import {
  loadTransfers,
  addTransfer,
  editTransfer,
  removeTransfer,
} from '../features/warehouseTransfers/warehouseTransfersSlice';
import WarehouseTransferDialog from '../components/WarehouseTransferDialog';

export default function WarehouseTransfersPage() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.warehouseTransfers || { list: [], status: 'idle' });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { dispatch(loadTransfers()); }, [dispatch]);

  const handleCreate = async (data) => {
    await dispatch(addTransfer(data)).unwrap();
    dispatch(loadTransfers());
  };

  const handleEdit = async (data) => {
    await dispatch(editTransfer({ id: editing.id, payload: data })).unwrap();
    dispatch(loadTransfers());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا التحويل؟')) return;
    await dispatch(removeTransfer(id)).unwrap();
    dispatch(loadTransfers());
  };

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID', size: 60 },
    { accessorKey: 'fromWarehouse.name', header: 'من مخزن' },
    { accessorKey: 'toWarehouse.name', header: 'إلى مخزن' },
    { accessorKey: 'transfer_date', header: 'تاريخ التحويل' },
    { accessorKey: 'note', header: 'ملاحظة' },
  ], []);

  return (
    <Box p={2}>
      <Typography variant="h6" mb={2}>تحويلات المخازن</Typography>

      <Box mb={2} display="flex" gap={1}>
        <Button startIcon={<Add />} variant="contained" onClick={() => { setEditing(null); setOpen(true); }}>
          إضافة تحويل
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={list || []}
        state={{ isLoading: status === 'loading' }}
        enableRowActions
        positionActionsColumn="last"
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="primary" onClick={() => { setEditing(row.original); setOpen(true); }}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
              <Delete />
            </IconButton>
          </Box>
        )}
      />

      <WarehouseTransferDialog
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSaved={async (form) => {
          if (editing) return handleEdit(form);
          return handleCreate(form);
        }}
      />
    </Box>
  );
}
