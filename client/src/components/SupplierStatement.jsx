import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchSupplierStatement } from "../api/supplierLedgerApi";
import { defaultTableProps } from "../config/tableConfig";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ar } from "date-fns/locale";
import { MaterialReactTable } from "material-react-table";

export default function SupplierStatement({ supplierId, fromParam, toParam }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [from, setFrom] = useState(fromParam ? new Date(fromParam) : null);
  const [to, setTo] = useState(toParam ? new Date(toParam) : null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchSupplierStatement(supplierId, {
        from: from ? from.toISOString().slice(0, 10) : "",
        to: to ? to.toISOString().slice(0, 10) : "",
      });
      setData(result);
      setError("");

      // تحديث الـ URL عشان يحفظ الفلتر
      const params = new URLSearchParams();
      if (from) params.set("from", from.toISOString().slice(0, 10));
      if (to) params.set("to", to.toISOString().slice(0, 10));
      navigate({
        pathname: `/suppliers/${supplierId}/statement`,
        search: params.toString(),
      });
    } catch (err) {
      setError(err.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2 }}>جاري التحميل...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  // حماية لو الـ API رجع null أو فارغ
  const supplierName = data?.supplier?.name ?? "غير معروف";
  const openingBalance = Number(data?.opening_balance ?? 0);
  const closingBalance = Number(data?.closing_balance ?? 0);
  const statementRows = Array.isArray(data?.statement) ? data.statement : [];

  const columns = [
    { accessorKey: "date", header: "التاريخ" },
    { accessorKey: "description", header: "الوصف" },
    {
      accessorKey: "debit",
      header: "مدين",
      Cell: ({ cell }) => Number(cell.getValue() ?? 0).toFixed(2),
    },
    {
      accessorKey: "credit",
      header: "دائن",
      Cell: ({ cell }) => Number(cell.getValue() ?? 0).toFixed(2),
    },
    {
      accessorKey: "running_balance",
      header: "الرصيد",
      Cell: ({ cell }) => Number(cell.getValue() ?? 0).toFixed(2),
    },
  ];

  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", p: 2, boxShadow: 4 }}>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            كشف حساب: {supplierName}
          </Typography>
        }
      />
      <CardContent>
        {/* فلاتر التاريخ */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
          <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center" mb={3}>
            <DatePicker
              label="من تاريخ"
              value={from}
              onChange={(newValue) => setFrom(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="إلى تاريخ"
              value={to}
              onChange={(newValue) => setTo(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={loadData}
              sx={{ height: 40 }}
            >
              تحديث
            </Button>
          </Box>
        </LocalizationProvider>

        {/* رصيد افتتاحي */}
        <Typography variant="subtitle1" gutterBottom>
          <strong>الرصيد الافتتاحي:</strong> {openingBalance.toFixed(2)}
        </Typography>

        {/* جدول الحركة */}
        <MaterialReactTable
          columns={columns}
          data={statementRows}
          {...defaultTableProps}
          enableColumnFilters={false}
          enableDensityToggle={false}
          enableSorting
          muiTableProps={{ sx: { borderRadius: 2 } }}
          muiTableBodyRowProps={{ hover: true }}
          initialState={{ density: "comfortable" }}
        />

        {/* رصيد ختامي */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color="primary"
          align="center"
          mt={3}
        >
          الرصيد الختامي: {closingBalance.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
