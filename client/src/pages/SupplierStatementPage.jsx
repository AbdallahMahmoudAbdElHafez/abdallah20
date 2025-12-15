import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import SupplierStatement from "../components/SupplierStatement";
import { useEffect, useState } from "react";
import partiesApi from "../api/partiesApi";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ar } from "date-fns/locale";

export default function SupplierStatementPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [suppliers, setSuppliers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await partiesApi.getSuppliers();
        setSuppliers(res.data);
      } catch (err) {
        console.error("خطأ في جلب الموردين:", err);
      }
    };
    loadSuppliers();
  }, []);

  // فتح الديالوج إذا لم يكن هناك مورد محدد
  useEffect(() => {
    if (!supplierId && suppliers.length > 0) {
      setDialogOpen(true);
    }
  }, [supplierId, suppliers]);

  const handleSupplierChange = (event) => {
    navigate(`/suppliers/${event.target.value}/statement`);
  };

  const handleDialogSubmit = () => {
    if (!selectedSupplier) {
      alert("يرجى اختيار مورد");
      return;
    }

    const params = new URLSearchParams();
    if (fromDate) params.set("from", fromDate.toISOString().slice(0, 10));
    if (toDate) params.set("to", toDate.toISOString().slice(0, 10));

    navigate({
      pathname: `/suppliers/${selectedSupplier}/statement`,
      search: params.toString(),
    });

    setDialogOpen(false);
  };

  return (
    <div className="container mx-auto mt-8">
      {/* Dialog لاختيار المورد والفترة */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          اختر المورد والفترة
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="supplier-dialog-select-label">اختر المورد</InputLabel>
              <Select
                labelId="supplier-dialog-select-label"
                value={selectedSupplier}
                label="اختر المورد"
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                {suppliers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ar}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="من تاريخ"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="إلى تاريخ"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleDialogSubmit}
            variant="contained"
            color="primary"
          >
            عرض كشف الحساب
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dropdown لتغيير المورد */}
      {supplierId && (
        <Box sx={{ mb: 3, maxWidth: 300 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="supplier-select-label">اختر المورد</InputLabel>
            <Select
              labelId="supplier-select-label"
              value={supplierId || ""}
              label="اختر المورد"
              onChange={handleSupplierChange}
            >
              {suppliers.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {supplierId && !isNaN(supplierId) && (
        <SupplierStatement
          supplierId={supplierId}
          fromParam={fromParam}
          toParam={toParam}
        />
      )}
    </div>
  );
}
