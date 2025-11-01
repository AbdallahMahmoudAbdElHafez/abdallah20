import api from './axiosClient';

const productCostsApi = {
  getAll: () => api.get('/product-costs'),
  create: (data) => api.post('/product-costs', data),
  update: (id, data) => api.put(`/product-costs/${id}`, data),
  delete: (id) => api.delete(`/product-costs/${id}`),
};

export default productCostsApi;
