import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Stack, Typography, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductCosts,
  createProductCost,
  updateProductCost,
  deleteProductCost
} from '../features/productCosts/productCostsSlice';
import api from '../api/axiosClient';
import { MaterialReactTable } from 'material-react-table';
import { defaultTableProps } from "../config/tableConfig";

export default function ProductCostsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.productCosts);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    product_id: '',
    cost: '',
    start_date: '',
    end_date: '',
    note: ''
  });

  useEffect(() => { dispatch(fetchProductCosts()); }, [dispatch]);
  useEffect(() => { api.get('/products').then((r) => setProducts(r.data)); }, []);

  const resetForm = () => {
    setForm({ product_id: '', cost: '', start_date: '', end_date: '', note: '' });
    setEditing(null);
  };

  const handleSubmit = async () => {
    if (!form.product_id || !form.cost || !form.start_date) return;
    if (editing)
      await dispatch(updateProductCost({ id: editing.id, data: form }));
    else
      await dispatch(createProductCost(form));
    setOpen(false);
    resetForm();
  };

  const handleEdit = (row) => {
    setEditing(row);
    setForm({
      product_id: row.product_id,
      cost: row.cost,
      start_date: row.start_date,
      end_date: row.end_date || '',
      note: row.note || ''
    });
    setOpen(true);
  };

  const columns = [
    { accessorKey: 'id', header: 'ID', size: 60 },
    { accessorKey: 'product.name', header: 'المنتج' },
    { accessorKey: 'cost', header: 'التكلفة' },
    { accessorKey: 'start_date', header: 'تاريخ البداية' },
    { accessorKey: 'end_date', header: 'تاريخ النهاية' },
    { accessorKey: 'note', header: 'ملاحظات' },
    {
      header: 'إجراءات',
      Cell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEdit(row.original)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => dispatch(deleteProductCost(row.original.id))}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">تكاليف المنتجات</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>إضافة تكلفة</Button>
      </Stack>

      <MaterialReactTable columns={columns} data={list || []} state={{ isLoading: loading }} />

      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }} fullWidth>
        <DialogTitle>{editing ? 'تعديل تكلفة' : 'إضافة تكلفة'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="المنتج"
              value={form.product_id}
              onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            >
              <MenuItem value="">اختر المنتج</MenuItem>
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="التكلفة"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />

            <TextField
              type="date"
              label="تاريخ البداية"
              InputLabelProps={{ shrink: true }}
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />

            <TextField
              type="date"
              label="تاريخ النهاية"
              InputLabelProps={{ shrink: true }}
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />

            <TextField
              label="ملاحظات"
              multiline
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
