import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

// Request counter
let requestCount = 0;

// Interceptor to track requests and add token from localStorage if needed
axiosInstance.interceptors.request.use(request => {
    requestCount++;
    console.log(`Requests Sent: ${requestCount}, URL: ${request.url}`);
    
    // If this is a request that might need authorization
    if (!request.url.includes('/login') && !request.url.includes('/register')) {
        // Check if the authentication header is already set (from cookies)
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken && !request.headers.Authorization) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    
    return request;
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Attempt to refresh token using the one in localStorage
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    return Promise.reject(error);
                }
                
                // Call refresh endpoint
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/refresh-token`,
                    { refreshToken },
                    { withCredentials: true }
                );
                
                // If token refresh is successful
                if (response.data?.data?.accessToken) {
                    // Update localStorage
                    localStorage.setItem('accessToken', response.data.data.accessToken);
                    if (response.data.data.refreshToken) {
                        localStorage.setItem('refreshToken', response.data.data.refreshToken);
                    }
                    
                    // Update header and retry
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Only redirect if we're in a browser context
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        }
        
        return Promise.reject(error);
    }
);
