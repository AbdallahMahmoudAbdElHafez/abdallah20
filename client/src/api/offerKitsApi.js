import api from './axiosClient';

export const offerKitsApi = {
    getAll: async () => {
        const response = await api.get('/offer-kits');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/offer-kits/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/offer-kits', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/offer-kits/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/offer-kits/${id}`);
        return response.data;
    }
};
