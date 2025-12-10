import axios from "axios";

// استدعاء كشف حساب العميل
export async function fetchCustomerStatement(customerId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const { data } = await axios.get(`/api/customers/${customerId}/statement?${query}`);
    return data;
}
