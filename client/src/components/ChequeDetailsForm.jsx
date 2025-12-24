import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function ChequeDetailsForm({ chequeDetails, setChequeDetails, error }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setChequeDetails({ ...chequeDetails, [name]: value });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
            <Typography variant="subtitle1">تفاصيل الشيك</Typography>
            <TextField
                label="رقم الشيك"
                name="cheque_number"
                value={chequeDetails.cheque_number}
                onChange={handleChange}
                fullWidth
                required
                error={!!error && !chequeDetails.cheque_number}
            />
            <TextField
                label="تاريخ الإصدار"
                name="issue_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={chequeDetails.issue_date}
                onChange={handleChange}
                fullWidth
                required
                error={!!error && !chequeDetails.issue_date}
            />
            <TextField
                label="تاريخ الاستحقاق"
                name="due_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={chequeDetails.due_date}
                onChange={handleChange}
                fullWidth
                required
                error={!!error && !chequeDetails.due_date}
            />
            <TextField
                label="اسم البنك"
                name="bank_name"
                value={chequeDetails.bank_name}
                onChange={handleChange}
                fullWidth
            />
        </Box>
    );
}
