import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const IssueVoucherDetails = ({ open, onClose, voucher, onStatusUpdate }) => {
  if (!voucher) return null;

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      approved: 'success',
      posted: 'info',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const totalAmount = voucher.items?.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) * parseFloat(item.unit_price || 0));
  }, 0) || 0;

  const handleStatusUpdate = (newStatus) => {
    if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      onStatusUpdate(voucher.id, newStatus);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Issue Voucher Details - {voucher.voucher_no}
          </Typography>
          <Box>
            <IconButton>
              <PrintIcon />
            </IconButton>
            <IconButton>
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* معلومات الرأس */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Voucher Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Voucher No:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.voucher_no}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Doctor:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.doctor?.name || 'N/A'}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Status:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Chip
                        label={voucher.status}
                        color={getStatusColor(voucher.status)}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Issue Date:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.issue_date}</Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Parties Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Party:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.party?.name || 'N/A'}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Employee:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.responsible_employee?.name || 'N/A'}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Warehouse:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.warehouse?.name}</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body2" color="textSecondary">Issued By:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body1">{voucher.issuer?.name || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {voucher.note && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="textSecondary">Note:</Typography>
                  <Typography variant="body1">{voucher.note}</Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* تفاصيل الأصناف */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Items Details</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Batch</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Cost/Unit</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {voucher.items?.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.product?.name}</TableCell>
                      <TableCell>{item.warehouse?.name}</TableCell>
                      <TableCell>{item.batch_number || 'N/A'}</TableCell>
                      <TableCell>{item.expiry_date || 'N/A'}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                      <TableCell align="right">{parseFloat(item.cost_per_unit).toFixed(2)}</TableCell>
                      <TableCell align="right">
                        {(item.quantity * item.unit_price).toFixed(2)}
                      </TableCell>
                      <TableCell>{item.note || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {(!voucher.items || voucher.items.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* الإجماليات */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Paper sx={{ p: 2, minWidth: 200 }}>
                <Typography variant="h6" align="right">
                  Total Amount: {totalAmount.toFixed(2)}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* أزرار تغيير الحالة */}
          {voucher.status === 'draft' && (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleStatusUpdate('approved')}
            >
              Approve
            </Button>
          )}
          {voucher.status === 'approved' && (
            <Button
              variant="contained"
              color="info"
              onClick={() => handleStatusUpdate('posted')}
            >
              Post
            </Button>
          )}
          {(voucher.status === 'draft' || voucher.status === 'approved') && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleStatusUpdate('cancelled')}
            >
              Cancel
            </Button>
          )}
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default IssueVoucherDetails;