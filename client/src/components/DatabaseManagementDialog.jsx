
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/database';

const DatabaseManagementDialog = ({ open, onClose }) => {
    const [password, setPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [databases, setDatabases] = useState([]);
    const [selectedDb, setSelectedDb] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isVerified) {
            fetchDatabases();
        }
    }, [isVerified]);

    const fetchDatabases = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/list`);
            setDatabases(response.data);
        } catch (err) {
            setError('فشل في تحميل قواعد البيانات');
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_BASE_URL}/verify`, { password });
            setIsVerified(true);
        } catch (err) {
            setError(err.response?.data?.message || 'كلمة المرور غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    const handleBackup = async () => {
        if (!selectedDb) return setError('يرجى اختيار قاعدة بيانات');
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(`${API_BASE_URL}/backup`, { dbName: selectedDb, password });
            setSuccess(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'فشل في عمل النسخة الاحتياطية');
        } finally {
            setLoading(false);
        }
    };

    const handleSwitch = async () => {
        if (!selectedDb) return setError('يرجى اختيار قاعدة بيانات');
        if (!window.confirm(`هل أنت متأكد من الانتقال إلى قاعدة البيانات ${selectedDb}؟ سيتم إعادة تشغيل السيرفر.`)) return;

        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post(`${API_BASE_URL}/switch`, { dbName: selectedDb, password });
            setSuccess(response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'فشل في تغيير قاعدة البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setIsVerified(false);
        setSelectedDb('');
        setError('');
        setSuccess('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth dir="rtl">
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>إدارة قواعد البيانات</DialogTitle>
            <DialogContent>
                {!isVerified ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" gutterBottom>يرجى إدخال كلمة المرور للمتابعة:</Typography>
                        <TextField
                            fullWidth
                            type="password"
                            label="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel>اختر قاعدة البيانات</InputLabel>
                            <Select
                                value={selectedDb}
                                label="اختر قاعدة البيانات"
                                onChange={(e) => setSelectedDb(e.target.value)}
                            >
                                {databases.map((db) => (
                                    <MenuItem key={db} value={db}>{db}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleBackup}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'عمل نسخة احتياطية'}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={handleSwitch}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'تغيير قاعدة البيانات'}
                            </Button>
                        </Box>
                    </Box>
                )}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                {!isVerified ? (
                    <Button onClick={handleVerify} variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'دخول'}
                    </Button>
                ) : null}
                <Button onClick={handleClose} variant="outlined">إغلاق</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DatabaseManagementDialog;
