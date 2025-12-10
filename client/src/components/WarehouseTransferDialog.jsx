import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, IconButton, Typography, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import PropTypes from 'prop-types';
import api from '../api/axiosClient';

export default function WarehouseTransferDialog({ open, onClose, initial, onSaved }) {
  const [form, setForm] = useState({
    from_warehouse_id: '',
    to_warehouse_id: '',
    transfer_date: '',
    note: '',
  });
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: '',
    cost_per_unit: '',
  });

  // تحميل بيانات التعديل إن وجدت
  useEffect(() => {
    setForm(initial || { from_warehouse_id: '', to_warehouse_id: '', transfer_date: '', note: '' });
    setItems(initial?.items || []);
  }, [initial]);

  // تحميل المخازن والمنتجات
  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get('/warehouses'),
      api.get('/products'),
    ]).then(([wRes, pRes]) => {
      if (mounted) {
        setWarehouses(wRes.data);
        setProducts(pRes.data);
      }
    }).catch(() => { });
    return () => { mounted = false; };
  }, []);

  const handleProductChange = async (e) => {
    const productId = e.target.value;
    setNewItem({ ...newItem, product_id: productId });

    if (productId) {
      try {
        const res = await api.get(`/inventory-transaction-batches/cost/${productId}`);
        if (res.data && res.data.cost) {
          setNewItem(prev => ({ ...prev, cost_per_unit: res.data.cost }));
        }
      } catch (err) {
        console.error("Failed to fetch cost", err);
      }
    }
  };

  const handleAddItem = () => {
    if (!newItem.product_id || !newItem.quantity || !newItem.cost_per_unit) return;
    const product = products.find(p => p.id === parseInt(newItem.product_id));
    setItems([...items, { ...newItem, product_name: product?.name }]);
    setNewItem({ product_id: '', quantity: '', cost_per_unit: '', batch_number: '', expiry_date: '' });
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.from_warehouse_id || !form.to_warehouse_id) return;
    try {
      const payload = { ...form, items };
      await onSaved(payload);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{initial ? 'تعديل تحويل' : 'إضافة تحويل'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            select
            label="من مخزن"
            value={form.from_warehouse_id}
            onChange={(e) => setForm({ ...form, from_warehouse_id: e.target.value })}
          >
            <MenuItem value="">اختر المخزن</MenuItem>
            {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
          </TextField>

          <TextField
            select
            label="إلى مخزن"
            value={form.to_warehouse_id}
            onChange={(e) => setForm({ ...form, to_warehouse_id: e.target.value })}
          >
            <MenuItem value="">اختر المخزن</MenuItem>
            {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
          </TextField>

          <TextField
            type="datetime-local"
            label="تاريخ التحويل"
            InputLabelProps={{ shrink: true }}
            value={form.transfer_date}
            onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
          />

          <TextField
            label="ملاحظة"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            multiline
            rows={3}
          />

          {/* عناصر التحويل */}
          <Typography variant="h6" mt={2}>الأصناف</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <TextField
              select
              label="المنتج"
              value={newItem.product_id}
              onChange={handleProductChange}
              sx={{ flex: 2, minWidth: '200px' }}
            >
              <MenuItem value="">اختر المنتج</MenuItem>
              {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField
              label="الكمية"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              sx={{ flex: 1, minWidth: '100px' }}
            />
            <TextField
              label="التكلفة للوحدة"
              type="number"
              value={newItem.cost_per_unit}
              onChange={(e) => setNewItem({ ...newItem, cost_per_unit: e.target.value })}
              sx={{ flex: 1, minWidth: '100px' }}
            />
            <TextField
              label="رقم التشغيلة"
              value={newItem.batch_number || ''}
              onChange={(e) => setNewItem({ ...newItem, batch_number: e.target.value })}
              sx={{ flex: 1, minWidth: '120px' }}
            />
            <TextField
              label="تاريخ الصلاحية"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={newItem.expiry_date || ''}
              onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
              sx={{ flex: 1, minWidth: '150px' }}
            />
            <IconButton color="primary" onClick={handleAddItem}>
              <Add />
            </IconButton>
          </Stack>

          {/* جدول العناصر */}
          {items.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>المنتج</TableCell>
                  <TableCell>الكمية</TableCell>
                  <TableCell>التكلفة للوحدة</TableCell>
                  <TableCell>الإجمالي</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.cost_per_unit}</TableCell>
                    <TableCell>{(item.quantity * item.cost_per_unit).toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDeleteItem(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button variant="contained" onClick={handleSubmit}>{initial ? 'حفظ' : 'إضافة'}</Button>
      </DialogActions>
    </Dialog>
  );
}

WarehouseTransferDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  initial: PropTypes.object,
  onSaved: PropTypes.func.isRequired,
};
