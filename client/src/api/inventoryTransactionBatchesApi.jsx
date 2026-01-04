import axiosClient from "./axiosClient";

const inventoryTransactionBatchesApi = {
    getLatestCost: (productId, batchNumber = null) => {
        const url = `/inventory-transaction-batches/cost/${productId}${batchNumber ? `?batchNumber=${batchNumber}` : ''}`;
        return axiosClient.get(url);
    },
};

export default inventoryTransactionBatchesApi;
