import axios from "axios";

// استدعاء كشف حساب العميل
export async function fetchCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/customers/${customerId}/statement?${query}`);
    return data;
}

// استدعاء كشف حساب العميل التفصيلي
export async function fetchDetailedCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/customers/${customerId}/statement-detailed?${query}`);
    return data;
}

// تصدير كشف حساب العميل التفصيلي إلى Excel
export async function exportDetailedCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`/api/customers/${customerId}/export-detailed?${query}`, {
        responseType: 'blob'
    });
    return response.data;
}

// تصدير كشف حساب العميل إلى Excel
export async function exportCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await axios.get(`/api/customers/${customerId}/export?${query}`, {
        responseType: 'blob'
    });
    return response.data;
}
