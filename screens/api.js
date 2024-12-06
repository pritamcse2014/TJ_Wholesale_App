const API_BASE_URL = "https://wholesale.techjodo.xyz/api/v1"; // Replace with your actual API base URL

export const API_URLS = {
    logout: `${API_BASE_URL}/logout`,
    forgotPassword: `${API_BASE_URL}/forgot-password`,  // Add forgot password endpoint
    resetPassword: `${API_BASE_URL}/reset-password`,    // Add reset password endpoint
    getProducts: `${API_BASE_URL}/products`,
    getWholesellerProducts: `${API_BASE_URL}/wholeseller_products`,
    createOrder: `${API_BASE_URL}/order_requests`,
    getOrderRequests: (tokenable_id) => `${API_BASE_URL}/order_requests?tokenable_id=${tokenable_id}`, // Include tokenable_id as a query parameter
    // Add more endpoints as needed
};
