import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:3001";

export const axiosGet = async (
    endpoint: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void
) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api${endpoint}`);
        callback(response.data);
    } catch (error: any) {
        if (errorCallback) {
            errorCallback(error.response ? error.response.data : error);
        }
    }
};
