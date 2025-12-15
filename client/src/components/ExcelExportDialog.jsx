import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    Divider
} from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';

export default function ExcelExportDialog({ open, onClose, onExport, columns }) {
    const [selectedColumns, setSelectedColumns] = useState([]);

    useEffect(() => {
        if (open && columns) {
            // Select all by default when opening
            setSelectedColumns(columns.map(c => c.key));
        }
    }, [open, columns]);

    const handleToggle = (key) => {
        setSelectedColumns(prev => {
            if (prev.includes(key)) {
                return prev.filter(k => k !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedColumns.length === columns.length) {
            setSelectedColumns([]);
        } else {
            setSelectedColumns(columns.map(c => c.key));
        }
    };

    const handleExport = () => {
        onExport(selectedColumns);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>تصدير إلى Excel</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    اختر الأعمدة التي تريد تضمينها في ملف Excel:
                </Typography>
                <Box sx={{ mb: 1 }}>
                    <Button size="small" onClick={handleSelectAll}>
                        {selectedColumns.length === columns.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
                    </Button>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <FormGroup>
                    {columns.map((col) => (
                        <FormControlLabel
                            key={col.key}
                            control={
                                <Checkbox
                                    checked={selectedColumns.includes(col.key)}
                                    onChange={() => handleToggle(col.key)}
                                    size="small"
                                />
                            }
                            label={col.label}
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button
                    variant="contained"
                    onClick={handleExport}
                    startIcon={<FileDownloadIcon />}
                    disabled={selectedColumns.length === 0}
                >
                    تصدير
                </Button>
            </DialogActions>
        </Dialog>
    );
}
