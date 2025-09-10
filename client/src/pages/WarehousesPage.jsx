import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Breadcrumbs,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";

import {
    fetchWarehouses,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
} from "../features/warehouses/warehousesSlice";
import { fetchCities } from "../features/cities/citiesSlice";

const WarehousesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const cityId = searchParams.get("city_id");
    const { items: warehouses, loading } = useSelector((state) => state.warehouses);
    const { items: cities } = useSelector((state) => state.cities);

    const [openDialog, setOpenDialog] = useState(false);
    const [editWarehouse, setEditWarehouse] = useState(null);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedCity, setSelectedCity] = useState(cityId || "");

    useEffect(() => {

        dispatch(fetchWarehouses());
        dispatch(fetchCities());
    }, [dispatch]);

    const handleOpenDialog = (warehouse = null) => {
        if (warehouse) {
            setEditWarehouse(warehouse);
            setName(warehouse.name);
            setAddress(warehouse.address || "");
            setSelectedCity(warehouse.city_id || "");
        } else {
            setEditWarehouse(null);
            setName("");
            setAddress("");
            setSelectedCity(cityId || "");
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setName("");
        setAddress("");
        setSelectedCity(cityId || "");
        setEditWarehouse(null);
    };

    const handleSave = async () => {
        if (editWarehouse) {
            await dispatch(
                updateWarehouse({
                    id: editWarehouse.id,
                    data: { name, address, city_id: selectedCity },
                })
            );
        } else {
            await dispatch(addWarehouse({ name, address, city_id: selectedCity }));
        }
        handleCloseDialog();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this warehouse?")) {
            await dispatch(deleteWarehouse(id));
        }
    };

    const columns = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        {
            accessorKey: "city.name",
            header: "City",
        },
    ];

    return (
        <Box p={2}>
            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link underline="hover" color="inherit" onClick={() => navigate("/")}>
                    Home
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate("/countries")}>
                    Countries
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate(-2)}>
                    Governates
                </Link>
                <Link underline="hover" color="inherit" onClick={() => navigate(-1)}>
                    Cities
                </Link>
                <Typography color="text.primary">Warehouses</Typography>
            </Breadcrumbs>

            {/* Table */}
            <MaterialReactTable
                columns={columns}
                data={warehouses || []}
                state={{ isLoading: loading }}
                enablePagination
                enableSorting
                enableGlobalFilter
                enableRowActions
                renderRowActions={({ row }) => (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenDialog(row.original)}
                        >
                            Edit
                        </Button>
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            Delete
                        </Button>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button variant="contained" onClick={() => handleOpenDialog()}>
                        Add Warehouse
                    </Button>
                )}
            />

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>{editWarehouse ? "Edit Warehouse" : "Add Warehouse"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="city-label">City</InputLabel>
                        <Select
                            labelId="city-label"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            {cities.map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WarehousesPage;
