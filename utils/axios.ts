import axios from "axios";

export const axiosGet = async (
    endpoint: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void,
    accessToken?: boolean,
    timeout?: number
) => {
    try {
        const token = localStorage.getItem("token_access");
        const headers: any = {
            "ngrok-skip-browser-warning": "true",
            "X-Service-Token": process.env.NEXT_PUBLIC_SERVICE_TOKEN,
        };
        if (accessToken && token && token !== "not_user") {
            headers["Authorization"] = `Bearer ${token}`;
        };
        const response = await axios.get(
            `/api${endpoint}`,
            { timeout: timeout || 20000, headers }
        );
        callback(response.data);
    } catch (error: any) {
        if (errorCallback) {
            errorCallback(error.response ? error.response.data : error);
        };
        if (error?.response?.data === 'error_token') {
            localStorage.setItem("token_access", 'not_user');
        };
    }
};
