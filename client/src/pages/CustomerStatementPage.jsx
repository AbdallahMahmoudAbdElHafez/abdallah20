import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import CustomerStatement from "../components/CustomerStatement";
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
import { defaultTableProps } from "../config/tableConfig";
import { ar } from "date-fns/locale";

export default function CustomerStatementPage() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [customers, setCustomers] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const res = await partiesApi.getCustomers();
                setCustomers(res.data);
            } catch (err) {
                console.error("خطأ في جلب العملاء:", err);
            }
        };
        loadCustomers();
    }, []);

    // فتح الديالوج إذا لم يكن هناك عميل محدد
    useEffect(() => {
        if (!customerId && customers.length > 0) {
            setDialogOpen(true);
        }
    }, [customerId, customers]);

    const handleCustomerChange = (event) => {
        navigate(`/customers/${event.target.value}/statement`);
    };

    const handleDialogSubmit = () => {
        if (!selectedCustomer) {
            alert("يرجى اختيار عميل");
            return;
        }

        const params = new URLSearchParams();
        if (fromDate) params.set("from", fromDate.toISOString().slice(0, 10));
        if (toDate) params.set("to", toDate.toISOString().slice(0, 10));

        navigate({
            pathname: `/customers/${selectedCustomer}/statement`,
            search: params.toString(),
        });

        setDialogOpen(false);
    };

    return (
        <div className="container mx-auto mt-8">
            {/* Dialog لاختيار العميل والفترة */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                    اختر العميل والفترة
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel id="customer-dialog-select-label">اختر العميل</InputLabel>
                            <Select
                                labelId="customer-dialog-select-label"
                                value={selectedCustomer}
                                label="اختر العميل"
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                            >
                                {customers.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>
                                        {c.name}
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

            {/* Dropdown لتغيير العميل */}
            {customerId && (
                <Box sx={{ mb: 3, maxWidth: 300 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="customer-select-label">اختر العميل</InputLabel>
                        <Select
                            labelId="customer-select-label"
                            value={customerId || ""}
                            label="اختر العميل"
                            onChange={handleCustomerChange}
                        >
                            {customers.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            {customerId && (
                <CustomerStatement
                    customerId={customerId}
                    fromParam={fromParam}
                    toParam={toParam}
                />
            )}
        </div>
    );
}
