import axiosClient from "./axiosClient";

const batchInventoryApi = {
    getAvailableBatches: (productId, warehouseId) => {
        return axiosClient.get(`/batch-inventory/available/${productId}/${warehouseId}`);
    },
};

export default batchInventoryApi;
