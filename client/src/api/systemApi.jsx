import axiosClient from "./axiosClient";

const systemApi = {
    shutdown: () => axiosClient.post("/system/shutdown", {}),
    restart: () => axiosClient.post("/system/restart", {}),
};

export default systemApi;
