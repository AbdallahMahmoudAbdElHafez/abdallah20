import axios from "axios";

// استدعاء كشف حساب المورد
export async function fetchSupplierStatement(supplierId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`/api/suppliers/${supplierId}/statement?${query}`);
  return data;
}

// تصدير كشف حساب المورد إلى Excel
export async function exportSupplierStatement(supplierId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`/api/suppliers/${supplierId}/export?${query}`, {
    responseType: 'blob'
  });
  return response.data;
}
