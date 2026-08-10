import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParties,
  addParty,
  editParty,
  removeParty,
} from "../features/parties/partiesSlice";
import { fetchCities } from "../features/cities/citiesSlice";
import { fetchGovernates } from "../features/governates/governatesSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchPartyCategories } from "../features/partyCategories/partyCategoriesSlice";

import { MaterialReactTable } from "material-react-table";
import { defaultTableProps } from "../config/tableConfig";
import { exportToExcel } from "../utils/exportUtils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Breadcrumbs,
  Typography,
  MenuItem,
  Chip,
  Box,
  Autocomplete,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const partyTypes = [
  { value: "customer", label: "عميل" },
  { value: "supplier", label: "مورد" },
  { value: "both", label: "كلاهما" },
];

const PartiesPage = () => {
  const dispatch = useDispatch();
  const { items: parties, loading } = useSelector((state) => state.parties);
  const { items: cities } = useSelector((state) => state.cities);
  const { items: governates } = useSelector((state) => state.governates);
  const { items: accounts } = useSelector((state) => state.accounts);
  const { items: categories } = useSelector((state) => state.partyCategories);

  const [open, setOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [form, setForm] = useState({
    name: "",
    party_type: "customer",
    phone: "",
    email: "",
    address: "",
    tax_number: "",
    city_id: "",
    account_id: "",
    category_id: "",
  });

  useEffect(() => {
    dispatch(fetchParties());
    dispatch(fetchCities());
    dispatch(fetchGovernates());
    dispatch(fetchAccounts());
    dispatch(fetchPartyCategories());
  }, [dispatch]);

  const handleOpen = (party = null) => {
    setEditingParty(party);
    setForm(
      party || {
        name: "",
        party_type: "customer",
        phone: "",
        email: "",
        address: "",
        tax_number: "",
        city_id: "",
        account_id: "",
        category_id: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (editingParty) {
      dispatch(editParty({ id: editingParty.id, party: form }));
    } else {
      dispatch(addParty(form));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطرف؟")) {
      dispatch(removeParty(id));
    }
  };

  const handleExport = async (table) => {
    try {
      await exportToExcel(
        table.getFilteredRowModel().rows,
        table.getVisibleLeafColumns(),
        "العملاء_والموردين"
      );
    } catch (error) {
      console.error("Export failed:", error);
      alert("حدث خطأ أثناء محاولة تصدير الملف.");
    }
  };

  const columns = [
    { accessorKey: "name", header: "العملاء/المورديين" },
    {
      id: "party_type",
      header: "النوع",
      accessorFn: (row) => {
        const type = partyTypes.find((t) => t.value === row.party_type);
        return type ? type.label : row.party_type;
      },
      Cell: ({ cell, row }) => (
        <Chip
          label={cell.getValue()}
          color={
            row.original.party_type === "customer"
              ? "primary"
              : row.original.party_type === "supplier"
                ? "secondary"
                : "success"
          }
        />
      ),
    },
    {
      id: "city",
      header: "المدينة",
      accessorFn: (row) => {
        const city = cities.find((c) => c.id === row.city_id);
        return city ? city.name : "-";
      },
    },
    {
      id: "governate",
      header: "المحافظة",
      accessorFn: (row) => {
        const city = cities.find((c) => c.id === row.city_id);
        const governate = governates?.find((g) => g.id === city?.governate_id);
        return governate ? governate.name : "-";
      },
    },
    {
      id: "account",
      header: "الحساب",
      accessorFn: (row) => {
        const account = accounts.find((a) => a.id === row.account_id);
        return account ? account.name : "-";
      },
    },
    {
      id: "category",
      header: "التصنيف",
      accessorFn: (row) => {
        const cat = categories.find((c) => c.id === row.category_id);
        return cat ? cat.name : "-";
      },
    },
    { accessorKey: "phone", header: "التليفون" },
    { accessorKey: "email", header: "البريد" },
    { accessorKey: "tax_number", header: "الرقم الضريبي" },
    {
      header: "الإجراءات",
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => handleOpen(row.original)}>
            تعديل
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(row.original.id)}
          >
            حذف
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box p={2}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Typography color="inherit">الرئيسية</Typography>
        <Typography color="text.primary">العملاء/المورديين (Parties)</Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">العملاء/المورديين</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          إضافة مورد/عميل جديد
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        {...defaultTableProps}
        data={parties}
        state={{ isLoading: loading }}
        enableExporting
        renderTopToolbarCustomActions={({ table }) => (
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport(table)}
          >
            تصدير إلى Excel
          </Button>
        )}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingParty ? "تعديل " : "اضافه"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            select
            fullWidth
            margin="dense"
            label="النوع"
            value={form.party_type}
            onChange={(e) => setForm({ ...form, party_type: e.target.value })}
          >
            {partyTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.name}
            value={cities.find((c) => c.id === form.city_id) || null}
            onChange={(event, newValue) => {
              setForm({ ...form, city_id: newValue ? newValue.id : "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="المدينة"
                margin="dense"
                fullWidth
              />
            )}
          />


          <TextField
            select
            fullWidth
            margin="dense"
            label="التصنيف"
            value={form.category_id || ""}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <MenuItem value="">-- اختر التصنيف --</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label="التليفون"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="البريد"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="العنوان"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            fullWidth
            margin="dense"
            label="الرقم الضريبي"
            value={form.tax_number}
            onChange={(e) => setForm({ ...form, tax_number: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>إلغاء</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingParty ? "تحديث" : "إضافة"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartiesPage;
