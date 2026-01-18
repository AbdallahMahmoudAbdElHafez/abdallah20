import axios from "axios";

// استدعاء كشف حساب العميل
export async function fetchCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/customers/${customerId}/statement?${query}`);
    return data;
}

// تصدير كشف حساب العميل إلى Excel
export async function exportCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`/api/customers/${customerId}/export?${query}`, {
        responseType: 'blob'
    });
    return response.data;
}
