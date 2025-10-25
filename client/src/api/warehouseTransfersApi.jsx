// src/api/warehouseTransfersApi.jsx
import api from './axiosClient';

const BASE = '/warehouse-transfers';

export const fetchWarehouseTransfers = () => api.get(BASE);
export const createWarehouseTransfer = (payload) => api.post(BASE, payload);
export const updateWarehouseTransfer = (id, payload) => api.put(`${BASE}/${id}`, payload);
export const deleteWarehouseTransfer = (id) => api.delete(`${BASE}/${id}`);
