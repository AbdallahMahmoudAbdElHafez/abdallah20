import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchParties,
  addParty,
  editParty,
  removeParty,
} from "../features/parties/partiesSlice";
import { fetchCities } from "../features/cities/citiesSlice";
import { fetchAccounts } from "../features/accounts/accountsSlice";
import { fetchPartyCategories } from "../features/partyCategories/partyCategoriesSlice";

import { MaterialReactTable } from "material-react-table";
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
} from "@mui/material";

const partyTypes = [
  { value: "customer", label: "عميل" },
  { value: "supplier", label: "مورد" },
  { value: "both", label: "كلاهما" },
];

const PartiesPage = () => {
  const dispatch = useDispatch();
  const { items: parties, loading } = useSelector((state) => state.parties);
  const { items: cities } = useSelector((state) => state.cities);
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

  const columns = [
    { accessorKey: "name", header: "العملاء/المورديين" },
    {
      accessorKey: "party_type",
      header: "النوع",
      Cell: ({ cell }) => {
        const type = partyTypes.find((t) => t.value === cell.getValue());
        return (
          <Chip
            label={type?.label || cell.getValue()}
            color={
              cell.getValue() === "customer"
                ? "primary"
                : cell.getValue() === "supplier"
                ? "secondary"
                : "success"
            }
          />
        );
      },
    },
    {
      accessorKey: "city_id",
      header: "المدينة",
      Cell: ({ cell }) => {
        const city = cities.find((c) => c.id === cell.getValue());
        return city ? city.name : "-";
      },
    },
    {
      accessorKey: "account_id",
      header: "الحساب",
      Cell: ({ cell }) => {
        const account = accounts.find((a) => a.id === cell.getValue());
        return account ? account.name : "-";
      },
    },
    {
      accessorKey: "category_id",
      header: "التصنيف",
      Cell: ({ cell }) => {
        const cat = categories.find((c) => c.id === cell.getValue());
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
        data={parties}
        state={{ isLoading: loading }}
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

          <TextField
            select
            fullWidth
            margin="dense"
            label="المدينة"
            value={form.city_id || ""}
            onChange={(e) => setForm({ ...form, city_id: e.target.value })}
          >
            <MenuItem value="">-- اختر المدينة --</MenuItem>
            {cities.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            margin="dense"
            label="الحساب"
            value={form.account_id || ""}
            onChange={(e) => setForm({ ...form, account_id: e.target.value })}
          >
            <MenuItem value="">-- اختر الحساب --</MenuItem>
            {accounts.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

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
