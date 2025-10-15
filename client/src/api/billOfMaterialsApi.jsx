// src/api/billOfMaterialsApi.jsx
import axiosClient from './axiosClient';


const billOfMaterialsApi = {
    fetchBOM: (params) => axiosClient.get('/bill-of-material', { params }).then(r => r.data),
    fetchBOMById: (id) => axiosClient.get(`/bill-of-material/${id}`).then(r => r.data),
    createBOM: (payload) => axiosClient.post('/bill-of-material', payload).then(r => r.data),
    updateBOM: (id, payload) => axiosClient.put(`/bill-of-material/${id}`, payload).then(r => r.data),
    deleteBOM: (id) => axiosClient.delete(`/bill-of-material/${id}`).then(r => r.data),
}

export default billOfMaterialsApi;