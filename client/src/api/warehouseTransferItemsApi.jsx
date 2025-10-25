// src/api/warehouseTransferItemsApi.jsx
import api from './axiosClient';

const warehouseTransferItemsApi = {
  getAll: () => api.get('/warehouse-transfer-items'),
  getByTransfer: (transferId) => api.get(`/warehouse-transfer-items/transfer/${transferId}`),
  create: (data) => api.post('/warehouse-transfer-items', data),
  update: (id, data) => api.put(`/warehouse-transfer-items/${id}`, data),
  remove: (id) => api.delete(`/warehouse-transfer-items/${id}`),
};

export default warehouseTransferItemsApi;
