import axios from "axios";

// استدعاء كشف حساب المورد
export async function fetchSupplierStatement(supplierId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`/api/suppliers/${supplierId}/statement?${query}`);
  return data;
}
