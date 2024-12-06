import { API_URLS } from "../screens/api";
import axios from "../utilities/axios";
import { getToken, setToken } from "./TokenService";

export async function login(credentials) {
    const { data } = await axios.post("/login", credentials);
    await setToken(data.token);
    return data; // Return the full user data including role
}

export async function register(registerInfo) {
    const { data } = await axios.post("/register", registerInfo);
    await setToken(data.token);
}

export const loadUser = async () => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.get("/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Ensure this includes user and role
    } catch (error) {
        console.error("Error loading user:", error);
        throw error; // Propagate error for handling in the calling function
    }
};

export async function sendPasswordResetLink(email) {
    const { data } = await axios.post("/forgot-password", { email });
    return data.status;
}

export async function logout() {
    const token = await getToken(); // Retrieve token from storage

    if (!token) {
        throw new Error("No token found for logout.");
    }

    await axios.post(API_URLS.logout, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    await setToken(null); // Clear the token after logout
}