import axiosClient from "./axiosClient";

const API_URL = "/inventory-transactions";

export const fetchInventoryTransactionsApi = () => axiosClient.get(API_URL);
export const addInventoryTransactionApi = (data) => axiosClient.post(API_URL, data);
export const updateInventoryTransactionApi = (id, data) =>
  axiosClient.put(`${API_URL}/${id}`, data);
export const deleteInventoryTransactionApi = (id) =>
  axiosClient.delete(`${API_URL}/${id}`);
