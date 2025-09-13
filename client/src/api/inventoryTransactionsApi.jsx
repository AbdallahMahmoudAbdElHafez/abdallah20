import axios from "axios";

const API_URL = "/api/inventory-transactions";

export const fetchInventoryTransactionsApi = () => axios.get(API_URL);
export const addInventoryTransactionApi = (data) => axios.post(API_URL, data);
export const updateInventoryTransactionApi = (id, data) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteInventoryTransactionApi = (id) =>
  axios.delete(`${API_URL}/${id}`);
