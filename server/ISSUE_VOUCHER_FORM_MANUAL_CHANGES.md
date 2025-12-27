# تعليمات التعديلات المطلوبة - IssueVoucherForm.jsx

## الملف: `d:\db\client\src\components\IssueVoucherForm.jsx`

### 1. إضافة Import للدكاترة (السطر 42)
**بعد السطر:**
```javascript
import { fetchAccounts } from '../features/accounts/accountsSlice';
```

**أضف:**
```javascript
import { fetchDoctors } from '../features/doctors/doctorsSlice';
```

---

### 2. إضافة Doctors State (السطر 54)
**بعد السطر:**
```javascript
const { items: accounts, loading: accountsLoading } = useSelector(state => state.accounts);
```

**أضف:**
```javascript
const { list: doctors, loading: doctorsLoading } = useSelector(state => state.doctors);
```

---

### 3. إضافة doctor_id في formData State (السطر 60)
**غيّر من:**
```javascript
const [formData, setFormData] = useState({
  voucher_no: '',
  type_id: '',
  party_id: '',
  employee_id: '',
  warehouse_id: '',
  account_id: '',
  issue_date: new Date(),
  note: ''
});
```

**إلى:**
```javascript
const [formData, setFormData] = useState({
  voucher_no: '',
  type_id: '',
  party_id: '',
  employee_id: '',
  doctor_id: '',    // <-- أضف هذا السطر
  warehouse_id: '',
  account_id: '',
  issue_date: new Date(),
  note: ''
});
```

---

### 4. إضافة fetchDoctors في useEffect (السطر 136)
**غيّر من:**
```javascript
useEffect(() => {
  if (open) {
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
    dispatch(fetchEmployees());
    dispatch(fetchParties());
    dispatch(fetchIssueVoucherTypes());
    dispatch(fetchAccounts());
  }
}, [open, dispatch]);
```

**إلى:**
```javascript
useEffect(() => {
  if (open) {
    dispatch(fetchProducts());
    dispatch(fetchWarehouses());
    dispatch(fetchEmployees());
    dispatch(fetchParties());
    dispatch(fetchIssueVoucherTypes());
    dispatch(fetchAccounts());
    dispatch(fetchDoctors());    // <-- أضف هذا السطر
  }
}, [open, dispatch]);
```

---

### 5. إضافة doctor_id عند التعديل (السطر 146)
**غيّر من:**
```javascript
setFormData({
  voucher_no: voucher.voucher_no || '',
  type_id: voucher.type_id || '',
  party_id: voucher.party_id || '',
  employee_id: voucher.employee_id || '',
  warehouse_id: voucher.warehouse_id || '',
  account_id: voucher.account_id || '',
  issue_date: voucher.issue_date ? new Date(voucher.issue_date) : new Date(),
  note: voucher.note || ''
});
```

**إلى:**
```javascript
setFormData({
  voucher_no: voucher.voucher_no || '',
  type_id: voucher.type_id || '',
  party_id: voucher.party_id || '',
  employee_id: voucher.employee_id || '',
  doctor_id: voucher.doctor_id || '',    // <-- أضف هذا السطر
  warehouse_id: voucher.warehouse_id || '',
  account_id: voucher.account_id || '',
  issue_date: voucher.issue_date ? new Date(voucher.issue_date) : new Date(),
  note: voucher.note || ''
});
```

---

### 6. إضافة doctor_id في submitData (السطر 238)
**غيّر من:**
```javascript
const submitData = {
  ...formData,
  type_id: formData.type_id || null,
  party_id: formData.party_id || null,
  employee_id: formData.employee_id || null,
  issue_date: formData.issue_date.toISOString().split('T')[0],
```

**إلى:**
```javascript
const submitData = {
  ...formData,
  type_id: formData.type_id || null,
  party_id: formData.party_id || null,
  employee_id: formData.employee_id || null,
  doctor_id: formData.doctor_id || null,    // <-- أضف هذا السطر
  issue_date: formData.issue_date.toISOString().split('T')[0],
```

---

### 7. تحديث isLoading (السطر 279)
**غيّر من:**
```javascript
const isLoading = productsLoading || warehousesLoading || employeesLoading || partiesLoading || voucherTypesLoading || accountsLoading;
```

**إلى:**
```javascript
const is Loading = productsLoading || warehousesLoading || employeesLoading || partiesLoading || voucherTypesLoading || accountsLoading || doctorsLoading;
```

---

### 8. إضافة Doctor Dropdown في الـ UI (بعد السطر 378 - بعد Employee Grid)
**بعد:**
```jsx
</Grid>

<Grid item xs={12} md={6}>
  <FormControl fullWidth error={!!errors.warehouse_id}>
    <InputLabel>Warehouse</InputLabel>
```

**أضف قبل grid Warehouse:**
```jsx
</Grid>

<Grid item xs={12} md={6}>
  <FormControl fullWidth>
    <InputLabel>Doctor</InputLabel>
    <Select
      value={formData.doctor_id}
      label="Doctor"
      onChange={(e) => handleFormChange('doctor_id', e.target.value)}
    >
      <MenuItem value="">None</MenuItem>
      {doctors.map(doctor => (
        <MenuItem key={doctor.id} value={doctor.id}>
          {doctor.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

<Grid item xs={12} md={6}>
  <FormControl fullWidth error={!!errors.warehouse_id}>
    <InputLabel>Warehouse</InputLabel>
```

---

## ✅ بعد التعديلات:
1. احفظ الملف
2. تأكد إن مافيش أخطاء syntax
3. الـ dev server هيعمل auto-reload

## ملاحظة
كل التعديلات دي مطلوبة عشان IssueVoucherForm يدعم اختيار الdoctor
