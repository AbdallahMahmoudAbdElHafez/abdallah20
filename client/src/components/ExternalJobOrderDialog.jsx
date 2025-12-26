import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Grid
} from "@mui/material";

export default function ExternalJobOrderDialog({
    open,
    onClose,
    onSave,
    initialData,
    suppliers,
    products,
    warehouses
}) {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{initialData.id ? "تعديل أمر تشغيل" : "أمر تشغيل جديد"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="المورد (المصنع)"
                            fullWidth
                            value={formData.party_id}
                            onChange={(e) => handleChange("party_id", e.target.value)}
                        >
                            {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="المخزن (للمواد الخام)"
                            fullWidth
                            value={formData.warehouse_id}
                            onChange={(e) => handleChange("warehouse_id", e.target.value)}
                        >
                            {warehouses.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            label="المنتج النهائي"
                            fullWidth
                            value={formData.product_id}
                            onChange={(e) => handleChange("product_id", e.target.value)}
                        >
                            {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="الكمية المطلوبة"
                            type="number"
                            fullWidth
                            value={formData.order_quantity}
                            onChange={(e) => handleChange("order_quantity", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="تاريخ البدء"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={formData.start_date}
                            onChange={(e) => handleChange("start_date", e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="تكلفة التشغيل التقديرية (للوحدة)"
                            type="number"
                            fullWidth
                            value={formData.estimated_processing_cost_per_unit}
                            onChange={(e) => handleChange("estimated_processing_cost_per_unit", e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button variant="contained" onClick={handleSave}>حفظ</Button>
            </DialogActions>
        </Dialog>
    );
}
