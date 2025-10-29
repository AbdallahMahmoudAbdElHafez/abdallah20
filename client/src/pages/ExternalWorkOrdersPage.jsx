import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, Stack, Typography
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExternalWorkOrders, createExternalWorkOrder, deleteExternalWorkOrder } from '../features/externalWorkOrders/externalWorkOrderSlice';
import api from '../api/axiosClient';
import { MaterialReactTable } from 'material-react-table';

export default function ExternalWorkOrderPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.externalWorkOrders);
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    supplier_id: '',
    product_id: '',
    order_date: null,
    quantity: '',
    status: 'pending',
    note: ''
  });

  useEffect(() => { dispatch(fetchExternalWorkOrders()); }, [dispatch]);

  useEffect(() => {
    api.get('/parties').then((r) => setSuppliers(r.data)).catch(() => { });
    api.get('/products').then((r) => setProducts(r.data)).catch(() => { });
  }, []);

  const handleSubmit = async () => {
    if (!form.supplier_id || !form.product_id || !form.quantity) return;
    console.log(form);
    await dispatch(createExternalWorkOrder(form));
    setOpen(false);
    setForm({
      supplier_id: '',
      product_id: '',
      order_date: null,
      quantity: '',
      status: 'pending',
      note: ''
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'ID', size: 60 },
    { accessorKey: 'supplier.name', header: 'المورد' },
    { accessorKey: 'product.name', header: 'المنتج' },
    { accessorKey: 'quantity', header: 'الكمية' },
    { accessorKey: 'order_date', header: 'تاريخ الطلب' },
    { accessorKey: 'status', header: 'الحالة' },
    { accessorKey: 'note', header: 'ملاحظات' },
  ];

  return (
    <Box p={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">أوامر التشغيل الخارجية</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>إضافة أمر تشغيل</Button>
      </Stack>
      <MaterialReactTable
        columns={columns}
        data={list || []}
        state={{ isLoading: loading }}
        muiTableBodyRowProps={({ row }) => ({
          onDoubleClick: () => dispatch(deleteExternalWorkOrder(row.original.id)),
          sx: { cursor: 'pointer' },
        })}
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>إضافة أمر تشغيل خارجي</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="المورد"
              value={form.supplier_id}
              onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
            >
              <MenuItem value="">اختر المورد</MenuItem>
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>

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
              label="الكمية"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            />

            <TextField
              select
              label="حالة التصنيع"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="pending">قيد الانتظار</MenuItem>
              <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
              <MenuItem value="completed">مكتمل</MenuItem>
              <MenuItem value="cancelled">ملغي</MenuItem>
            </TextField>


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
          <Button onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit}>حفظ</Button>
        </DialogActions>
      </Dialog>
    </Box>

  );
}