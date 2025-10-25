import axios from '../api/axiosClient';

const externalWorkOrdersApi = {
getAll: () => axios.get('/external-work-orders'),
create: (data) => axios.post('/external-work-orders', data),
update: (id, data) => axios.put(`/external-work-orders/${id}`, data),
delete: (id) => axios.delete(`/external-work-orders/${id}`),
};

export default externalWorkOrdersApi;