import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

export const axiosGet = async (
    endpoint: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void,
    accessToken?: boolean,
) => {
    try {
        const token = localStorage.getItem("token_access");
        const tokenQuery =
            accessToken && token && token !== "undefined"
                ? `${endpoint.includes("?") ? "&" : "?"}token=${token}`
                : "";
        const url = `${API_BASE_URL}/api${endpoint}${tokenQuery}`;
        const response = await axios.get(url, {
            timeout: 4000,
        });
        callback(response.data);
    } catch (error: any) {
        if (errorCallback) {
            errorCallback(error.response ? error.response.data : error);
        }
        if (error?.response?.data === "error_token") {
            localStorage.setItem("token_access", "not_user");
        }
    }
};
