// import axios from "axios";

// export const axiosInstance = axios.create({
//     // baseURL: import.meta.env.VITE_API_BASE_URL,
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     withCredentials :true
// })



import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

// Request counter
let requestCount = 0;

// Interceptor to track requests
axiosInstance.interceptors.request.use(request => {
    requestCount++;
    console.log(`Requests Sent: ${requestCount}, URL: ${request.url}`);
    return request;
});
