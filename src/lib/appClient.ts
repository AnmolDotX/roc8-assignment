import axios from "axios";
import Cookies from "js-cookie";

const appClient = axios.create({
    baseURL: process.env.API_BASE_URL,
});

appClient.interceptors.request.use(
    (config) => {
        let accessToken = null;

        if (typeof window !== 'undefined') {
            accessToken = Cookies.get('accessToken');
        }

        if (accessToken && accessToken !== '') {
            config.headers.Authorization = `Bearer ${accessToken}`; 
        }

        return config;
    },
    (error) => Promise.reject(error)
);  

export default appClient;
