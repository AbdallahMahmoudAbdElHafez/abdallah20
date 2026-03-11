import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Alert,
    Snackbar,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchIssueVoucherReturns,
    fetchIssueVoucherReturnById,
    deleteIssueVoucherReturn,
    updateReturnStatus,
    clearError,
    clearSuccess,
} from '../features/issueVoucherReturns/issueVoucherReturnsSlice';
import IssueVoucherReturnForm from '../components/IssueVoucherReturnForm';
import IssueVoucherReturnDetails from '../components/IssueVoucherReturnDetails';

const IssueVoucherReturnsPage = () => {
    const dispatch = useDispatch();
    const { returns, loading, error, success } = useSelector(state => state.issueVoucherReturns);

    const [showForm, setShowForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        dispatch(fetchIssueVoucherReturns());
    }, [dispatch]);

    const handleCloseAlert = () => {
        if (error) dispatch(clearError());
        if (success) dispatch(clearSuccess());
    };

    const handleAddReturn = () => {
        setSelectedReturn(null);
        setEditMode(false);
        setShowForm(true);
    };

    const handleEditReturn = async (record) => {
        try {
            const result = await dispatch(fetchIssueVoucherReturnById({ id: record.id, include_items: true })).unwrap();
            setSelectedReturn(result.data);
            setEditMode(true);
            setShowForm(true);
        } catch (error) {
            console.error('Failed to fetch return details:', error);
        }
    };

    const handleViewReturn = async (record) => {
        try {
            const result = await dispatch(fetchIssueVoucherReturnById({ id: record.id, include_items: true })).unwrap();
            setSelectedReturn(result.data);
            setShowDetails(true);
        } catch (error) {
            console.error('Failed to fetch return details:', error);
        }
    };

    const handleDeleteReturn = async (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المرتجع؟')) {
            await dispatch(deleteIssueVoucherReturn(id));
            dispatch(fetchIssueVoucherReturns());
        }
    };

    const handleUpdateStatus = async (id, status) => {
        await dispatch(updateReturnStatus({ id, status }));
        dispatch(fetchIssueVoucherReturns());
    };

    const handleRefresh = () => {
        dispatch(fetchIssueVoucherReturns());
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'default',
            approved: 'success',
            posted: 'info',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    const columns = [
        {
            accessorKey: 'return_no',
            header: 'رقم المرتجع',
            size: 130,
        },
        {
            accessorFn: (row) => row.issue_voucher?.voucher_no || 'N/A',
            id: 'issue_voucher_no',
            header: 'رقم اذن الصرف',
            size: 130,
        },
        {
            accessorFn: (row) => row.warehouse?.name || 'N/A',
            id: 'warehouse_name',
            header: 'المخزن',
            size: 130,
        },
        {
            accessorFn: (row) => row.employee?.name || 'N/A',
            id: 'employee_name',
            header: 'الموظف',
            size: 130,
        },
        {
            accessorKey: 'return_date',
            header: 'تاريخ المرتجع',
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'الحالة',
            size: 100,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue()}
                    color={getStatusColor(cell.getValue())}
                    size="small"
                />
            ),
        },
        {
            accessorKey: 'note',
            header: 'ملاحظة',
            size: 200,
            Cell: ({ cell }) => (
                <Typography variant="body2" noWrap title={cell.getValue()}>
                    {cell.getValue()}
                </Typography>
            ),
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            size: 150,
            Cell: ({ row }) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="عرض التفاصيل">
                        <IconButton
                            size="small"
                            onClick={() => handleViewReturn(row.original)}
                        >
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="تعديل">
                        <IconButton
                            size="small"
                            onClick={() => handleEditReturn(row.original)}
                            disabled={row.original.status !== 'draft'}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteReturn(row.original.id)}
                            disabled={row.original.status !== 'draft'}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    مرتجعات اذون الصرف
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        تحديث
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddReturn}
                    >
                        مرتجع جديد
                    </Button>
                </Box>
            </Box>

            {/* Alerts */}
            <Snackbar
                open={!!error || success}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity={error ? 'error' : 'success'}
                    sx={{ width: '100%' }}
                >
                    {error || 'تمت العملية بنجاح!'}
                </Alert>
            </Snackbar>

            {/* Returns Table */}
            <Card>
                <CardContent>
                    <MaterialReactTable
                        columns={columns}
                        data={returns}
                        state={{ isLoading: loading }}
                        enableColumnOrdering
                        enableGrouping
                        enablePinning
                        enableRowActions={false}
                        enableRowSelection={false}
                        initialState={{
                            density: 'compact',
                            columnVisibility: { note: false }
                        }}
                        muiTablePaperProps={{
                            elevation: 0,
                        }}
                        muiTableContainerProps={{
                            sx: { maxHeight: 'calc(100vh - 200px)' },
                        }}
                    />
                </CardContent>
            </Card>

            {/* Return Form Modal */}
            {showForm && (
                <IssueVoucherReturnForm
                    open={showForm}
                    onClose={() => setShowForm(false)}
                    returnData={selectedReturn}
                    editMode={editMode}
                    onSuccess={() => {
                        setShowForm(false);
                        dispatch(fetchIssueVoucherReturns());
                    }}
                />
            )}

            {/* Return Details Modal */}
            {showDetails && (
                <IssueVoucherReturnDetails
                    open={showDetails}
                    onClose={() => setShowDetails(false)}
                    returnData={selectedReturn}
                    onStatusUpdate={handleUpdateStatus}
                />
            )}
        </Box>
    );
};

export default IssueVoucherReturnsPage;
