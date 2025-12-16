import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box,
    Typography,
    Switch,
    FormControlLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addCompany, updateCompany } from "../features/companies/companiesSlice";
import { fetchCities } from "../features/cities/citiesSlice";

const CompanyDialog = ({ open, onClose, companyToEdit }) => {
    const dispatch = useDispatch();
    const cities = useSelector((state) => state.cities.items);

    const [formData, setFormData] = useState({
        company_name: "",
        company_name_en: "",
        commercial_register: "",
        tax_number: "",
        vat_number: "",
        company_type: "تجارية",
        phone: "",
        email: "",
        website: "",
        logo_path: "",
        address: "",
        city_id: "",
        established_date: "",
        is_active: true,
    });

    useEffect(() => {
        dispatch(fetchCities());
    }, [dispatch]);

    useEffect(() => {
        if (companyToEdit) {
            setFormData({
                ...companyToEdit,
                company_name_en: companyToEdit.company_name_en || "",
                commercial_register: companyToEdit.commercial_register || "",
                tax_number: companyToEdit.tax_number || "",
                vat_number: companyToEdit.vat_number || "",
                phone: companyToEdit.phone || "",
                email: companyToEdit.email || "",
                website: companyToEdit.website || "",
                logo_path: companyToEdit.logo_path || "",
                address: companyToEdit.address || "",
                established_date: companyToEdit.established_date || "",
                is_active: companyToEdit.is_active !== undefined ? companyToEdit.is_active : true,
            });
        } else {
            setFormData({
                company_name: "",
                company_name_en: "",
                commercial_register: "",
                tax_number: "",
                vat_number: "",
                company_type: "تجارية",
                phone: "",
                email: "",
                website: "",
                logo_path: "",
                address: "",
                city_id: "",
                established_date: "",
                is_active: true,
            });
        }
    }, [companyToEdit, open]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (companyToEdit) {
            // ... existing logic ...
            if (companyToEdit.logo_path) {
                setPreviewUrl(`http://localhost:5000/${companyToEdit.logo_path}`);
            } else {
                setPreviewUrl(null);
            }
        } else {
            // ... existing logic ...
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [companyToEdit, open]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!formData.company_name || !formData.company_type || !formData.city_id) {
            alert("يرجى ملء الحقول الإلزامية: اسم الشركة، النوع، والمدينة");
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'logo_path') { // Don't send the string path
                data.append(key, formData[key]);
            }
        });

        if (selectedFile) {
            data.append('logo', selectedFile);
        }

        if (companyToEdit) {
            await dispatch(updateCompany({ id: companyToEdit.id, data }));
        } else {
            await dispatch(addCompany(data));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{companyToEdit ? "تعديل شركة" : "إضافة شركة جديدة"}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* Logo Upload */}
                        <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="logo-upload"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="logo-upload">
                                <Button variant="outlined" component="span">
                                    {previewUrl ? 'تغيير اللوجو' : 'رفع لوجو'}
                                </Button>
                            </label>
                            {previewUrl && (
                                <Box sx={{ mt: 2 }}>
                                    <img src={previewUrl} alt="Logo Preview" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                                </Box>
                            )}
                        </Grid>

                        {/* Basic Info */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="اسم الشركة (عربي)"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="اسم الشركة (إنجليزي)"
                                name="company_name_en"
                                value={formData.company_name_en}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>نوع الشركة</InputLabel>
                                <Select
                                    name="company_type"
                                    value={formData.company_type}
                                    onChange={handleChange}
                                    label="نوع الشركة"
                                >
                                    <MenuItem value="تجارية">تجارية</MenuItem>
                                    <MenuItem value="صناعية">صناعية</MenuItem>
                                    <MenuItem value="خدمية">خدمية</MenuItem>
                                    <MenuItem value="حكومية">حكومية</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>المدينة</InputLabel>
                                <Select
                                    name="city_id"
                                    value={formData.city_id}
                                    onChange={handleChange}
                                    label="المدينة"
                                >
                                    {cities.map(city => (
                                        <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Registration Info */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="رقم السجل التجاري"
                                name="commercial_register"
                                value={formData.commercial_register}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="الرقم الضريبي"
                                name="tax_number"
                                value={formData.tax_number}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="رقم ضريبة القيمة المضافة"
                                name="vat_number"
                                value={formData.vat_number}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Contact Info */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="الهاتف"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="البريد الإلكتروني"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="الموقع الإلكتروني"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Other Info */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="تاريخ التأسيس"
                                type="date"
                                name="established_date"
                                value={formData.established_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="العنوان"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        name="is_active"
                                        color="primary"
                                    />
                                }
                                label="نشط"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    حفظ
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CompanyDialog;
