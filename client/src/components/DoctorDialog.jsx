import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchCities } from "../features/cities/citiesSlice";

export default function DoctorDialog({ open, onClose, onSave, doctor }) {
    const dispatch = useDispatch();
    const { items: cities } = useSelector((state) => state.cities);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        city_id: "",
        address: "",
    });

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    useEffect(() => {
        if (doctor) {
            setFormData({
                name: doctor.name || "",
                phone: doctor.phone || "",
                email: doctor.email || "",
                city_id: doctor.city_id || "",
                address: doctor.address || "",
            });
        } else {
            setFormData({
                name: "",
                phone: "",
                email: "",
                city_id: "",
                address: "",
            });
        }
    }, [doctor, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.name) {
            alert("يرجى إدخال اسم الطبيب");
            return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{doctor ? "تعديل بيانات طبيب" : "إضافة طبيب جديد"}</DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="name"
                            label="اسم الطبيب"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="phone"
                            label="رقم الهاتف"
                            fullWidth
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="email"
                            label="البريد الإلكتروني"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            name="city_id"
                            select
                            label="المدينة"
                            fullWidth
                            value={formData.city_id}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>اختر المدينة</em></MenuItem>
                            {cities.map((city) => (
                                <MenuItem key={city.id} value={city.id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="address"
                            label="العنوان"
                            fullWidth
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    حفظ
                </Button>
            </DialogActions>
        </Dialog>
    );
}
