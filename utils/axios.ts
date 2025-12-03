import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const axiosGet = async (
    endpoint: string,
    callback: (data: any) => void,
    errorCallback?: (error: any) => void,
    accessToken?: boolean,
) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api${endpoint}${accessToken ? `${endpoint.includes('?') ? '&' : '?'}token=${localStorage.getItem("token_access")}` : ''}`,
            {timeout: 2000}
        );
        callback(response.data);
    } catch (error: any) {
        if (errorCallback) {
            errorCallback(error.response ? error.response.data : error);
        }
        if(error?.response?.data == 'error_token') {
            localStorage.setItem("token_access", 'not_user');
        }
    }
};
