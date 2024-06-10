import axios from 'axios';
import { getDataLocal, setDataLocal, deleteDataLocal } from './localStorage';
const api = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
});
api.interceptors.request.use(
    async (request) => {
        const dataAccount = await getDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
        const token = dataAccount.access;
        if (token) { request.headers.Authorization = `Bearer ${token}`; }
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(
    (response) => { return response; },
    async (error) => {
        // const originalConfig = error.config;
        // if (error?.response?.status === 401 && error?.response?.data?.error?.code === 'token_not_valid') {
        //     let dataAccount = await getDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
        //     const refresh = dataAccount.data.refresh;
        //     let token;
        //     if (!refresh) {
        //         return Promise.reject(error);
        //     }
        //     try {
        //         const data = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/api/v1/token/refresh`, { refresh: refresh });
        //         if (data && data.data && data.data.success === 1) {
        //             token = data.data.data.access;
        //             originalConfig.headers.Authorization = `Bearer ${token}`;
        //             dataAccount.data.access = token;
        //             setDataLocal(process.env.EXPO_PUBLIC_ACCOUNT, dataAccount.data);
        //             return api(originalConfig);
        //         } else {
        //             const isResult = deleteDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
        //             if (isResult) {
        //                 this.props.history.push('/admin/login');
        //                 window.location.href = '/';
        //             }
        //             return Promise.reject(error);
        //         }
        //     } catch (error) {
        //         const isResult = deleteDataLocal(process.env.EXPO_PUBLIC_ACCOUNT);
        //         if (isResult) {
        //             window.location.href = '/';
        //         }
        //         return Promise.reject(error);
        //     }
        // }
        return Promise.reject(error);
    }
);

export default api;
