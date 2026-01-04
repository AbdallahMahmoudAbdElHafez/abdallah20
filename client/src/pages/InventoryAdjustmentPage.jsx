import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Grid,
    Alert,
    Snackbar,
    Paper,
    Divider,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import axios from "axios";
import { Inventory as InventoryIcon, Save as SaveIcon } from "@mui/icons-material";

const API_BASE = "http://localhost:5000/api";

export default function InventoryAdjustmentPage() {
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "success" });
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Map to store physical counts: { productId: physicalCount }
    const [physicalCounts, setPhysicalCounts] = useState({});

    useEffect(() => {
        fetchWarehouses();
    }, []);

    useEffect(() => {
        if (selectedWarehouse) {
            fetchProductsWithStock(selectedWarehouse);
        } else {
            setProducts([]);
        }
    }, [selectedWarehouse]);

    const fetchWarehouses = async () => {
        try {
            const r = await axios.get(`${API_BASE}/warehouses`);
            setWarehouses(r.data || []);
        } catch (err) {
            showMsg("فشل في تحميل المستودعات", "error");
        }
    };

    const fetchProductsWithStock = async (warehouseId) => {
        setLoading(true);
        try {
            const r = await axios.get(`${API_BASE}/products`, {
                params: { warehouse_id: warehouseId }
            });
            setProducts(r.data || []);
            // Reset physical counts when warehouse changes
            setPhysicalCounts({});
        } catch (err) {
            showMsg("فشل في تحميل الأصناف", "error");
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type = "success") => {
        setMessage({ text, type });
        setOpenSnackbar(true);
    };

    const handleCountChange = (productId, value) => {
        setPhysicalCounts(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    const handleAdjust = async (product) => {
        const physicalStr = physicalCounts[product.id];
        if (physicalStr === undefined || physicalStr === "") {
            showMsg("يرجى إدخال الكمية الفعلية أولاً", "warning");
            return;
        }

        const physical = Number(physicalStr);
        const book = Number(product.current_inventory?.[0]?.quantity || 0);
        const diff = physical - book;

        if (diff === 0) {
            showMsg("لا يوجد فرق لتسويته", "info");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                product_id: product.id,
                warehouse_id: selectedWarehouse,
                transaction_type: diff > 0 ? "in" : "out",
                quantity: Math.abs(diff),
                transaction_date: new Date().toISOString().split('T')[0],
                source_type: "adjustment",
                description: "تسوية جرد مخزون – تسوية فرق فعلي",
                note: `تسوية جرد آلي: فعلي(${physical}) - دفتري(${book})`,
                cost_per_unit: product.cost_price || 0
            };

            await axios.post(`${API_BASE}/inventory-transactions`, payload);
            showMsg("تمت التسوية بنجاح");
            // Refresh data
            fetchProductsWithStock(selectedWarehouse);
        } catch (err) {
            showMsg(err.response?.data?.message || "فشل في تنفيذ التسوية", "error");
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "الصنف",
            size: 250,
        },
        {
            accessorFn: (row) => row.current_inventory?.[0]?.quantity || 0,
            id: "book_qty",
            header: "الرصيد الدفتري",
            size: 150,
            Cell: ({ cell }) => (
                <Typography fontWeight="bold" color="primary">
                    {cell.getValue()}
                </Typography>
            )
        },
        {
            id: "physical_qty",
            header: "الكمية الفعلية",
            size: 150,
            Cell: ({ row }) => (
                <TextField
                    size="small"
                    type="number"
                    value={physicalCounts[row.original.id] || ""}
                    onChange={(e) => handleCountChange(row.original.id, e.target.value)}
                    placeholder="0"
                />
            )
        },
        {
            id: "diff",
            header: "الفرق",
            size: 100,
            Cell: ({ row }) => {
                const physical = physicalCounts[row.original.id];
                if (physical === undefined || physical === "") return "—";
                const book = Number(row.original.current_inventory?.[0]?.quantity || 0);
                const diff = Number(physical) - book;
                return (
                    <Typography color={diff > 0 ? "success.main" : diff < 0 ? "error.main" : "text.secondary"}>
                        {diff > 0 ? `+${diff}` : diff}
                    </Typography>
                );
            }
        },
        {
            id: "actions",
            header: "إجراء",
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={() => handleAdjust(row.original)}
                    disabled={saving || physicalCounts[row.original.id] === undefined || physicalCounts[row.original.id] === ""}
                >
                    تسوية
                </Button>
            )
        }
    ];

    return (
        <Box p={4} sx={{ direction: 'rtl' }}>
            <Typography variant="h4" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={2}>
                <InventoryIcon fontSize="large" /> تسوية جرد المخزون
            </Typography>

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>المستودع / المخزن</InputLabel>
                                <Select
                                    value={selectedWarehouse}
                                    label="المستودع / المخزن"
                                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                                >
                                    <MenuItem value=""><em>اختر المستودع</em></MenuItem>
                                    {warehouses.map((w) => (
                                        <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Alert severity="info" variant="outlined">
                                هذه الشاشة مخصصة لتسوية فروقات الجرد الفعلي. عند الضغط على "تسوية"، سيقوم النظام بإنشاء حركة مخزنية وقيد محاسبي تلقائي لفرق الكمية على حساب (114) فروقات جرد مخزون.
                            </Alert>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {selectedWarehouse && (
                <Paper elevation={3}>
                    <MaterialReactTable
                        {...defaultTableProps}
                        columns={columns}
                        data={products}
                        state={{ isLoading: loading }}
                        renderTopToolbarCustomActions={() => (
                            <Typography variant="h6" p={2}>قائمة الأصناف في المخزن المحدد</Typography>
                        )}
                    />
                </Paper>
            )}

            {!selectedWarehouse && (
                <Box textAlign="center" py={10} bgcolor="grey.50" borderRadius={2} border="2px dashed" borderColor="grey.300">
                    <Typography variant="h6" color="textSecondary">
                        يرجى اختيار مستودع لعرض الأصناف والبدء في الجرد
                    </Typography>
                </Box>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={message.type} variant="filled">
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
}
