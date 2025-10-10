import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import SupplierStatement from "../components/SupplierStatement";
import { useEffect, useState } from "react";
import partiesApi from "../api/partiesApi";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

export default function SupplierStatementPage() {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [suppliers, setSuppliers] = useState([]);

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

  const handleChange = (event) => {
    const selectedId = event.target.value;
    navigate(`/suppliers/${selectedId}/statement`); // يغير المورد فقط
  };

  return (
    <div className="container mx-auto mt-8">
      <Box sx={{ mb: 3, maxWidth: 300 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="supplier-select-label">اختر المورد</InputLabel>
          <Select
            labelId="supplier-select-label"
            value={supplierId || ""}
            label="اختر المورد"
            onChange={handleChange}
          >
            {suppliers.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
 
      {supplierId && (
        <SupplierStatement
          supplierId={supplierId}
          fromParam={fromParam}
          toParam={toParam}
        />
      )}
    </div>
  );
}
