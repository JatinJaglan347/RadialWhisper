import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL: "http://localhost:5500",
    withCredentials :true
})