import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Paper,
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
import { defaultTableProps } from "../config/tableConfig";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchIssueVouchers,
  deleteIssueVoucher,
  updateVoucherStatus,
  clearError,
  clearSuccess,
  setFilters
} from '../features/issueVouchers/issueVouchersSlice';
import IssueVoucherForm from '../components/IssueVoucherForm';
import IssueVoucherDetails from '../components/IssueVoucherDetails';

const IssueVouchersPage = () => {
  const dispatch = useDispatch();
  const { vouchers, loading, error, success } = useSelector(state => state.issueVouchers);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchIssueVouchers());
  }, [dispatch]);

  const handleCloseAlert = () => {
    if (error) dispatch(clearError());
    if (success) dispatch(clearSuccess());
  };

  const handleAddVoucher = () => {
    setSelectedVoucher(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEditVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setEditMode(true);
    setShowForm(true);
  };

  const handleViewVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowDetails(true);
  };

  const handleDeleteVoucher = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue voucher?')) {
      await dispatch(deleteIssueVoucher(id));
      dispatch(fetchIssueVouchers());
    }
  };

  const handleUpdateStatus = async (id, status) => {
    await dispatch(updateVoucherStatus({ id, status }));
    dispatch(fetchIssueVouchers());
  };

  const handleRefresh = () => {
    dispatch(fetchIssueVouchers());
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
      accessorKey: 'voucher_no',
      header: 'Voucher No',
      size: 120,
    },
    {
      accessorKey: 'type.name',
      header: 'Type',
      size: 120,
    },
    {
      accessorKey: 'party.name',
      header: 'Party',
      size: 150,
    },
    {
      accessorKey: 'warehouse.name',
      header: 'Warehouse',
      size: 120,
    },
    {
      accessorKey: 'issue_date',
      header: 'Issue Date',
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
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
      header: 'Note',
      size: 200,
      Cell: ({ cell }) => (
        <Typography variant="body2" noWrap title={cell.getValue()}>
          {cell.getValue()}
        </Typography>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 150,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewVoucher(row.original)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEditVoucher(row.original)}
              disabled={row.original.status !== 'draft'}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteVoucher(row.original.id)}
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
          Issue Vouchers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddVoucher}
          >
            New Issue Voucher
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
          {error || 'Operation completed successfully!'}
        </Alert>
      </Snackbar>

      {/* Vouchers Table */}
      <Card>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={vouchers}
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

      {/* Issue Voucher Form Modal */}
      {showForm && (
        <IssueVoucherForm
          open={showForm}
          onClose={() => setShowForm(false)}
          voucher={selectedVoucher}
          editMode={editMode}
          onSuccess={() => {
            setShowForm(false);
            dispatch(fetchIssueVouchers());
          }}
        />
      )}

      {/* Issue Voucher Details Modal */}
      {showDetails && (
        <IssueVoucherDetails
          open={showDetails}
          onClose={() => setShowDetails(false)}
          voucher={selectedVoucher}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </Box>
  );
};

export default IssueVouchersPage;