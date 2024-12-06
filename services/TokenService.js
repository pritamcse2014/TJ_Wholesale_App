// TokenService.js (update this as well)
import * as SecureStore from "expo-secure-store";

let token = null;

export async function setToken(newToken) {
    token = newToken;
    console.log("Setting token:", token); // Log the token being set
    try {
        if (token !== null) {
            await SecureStore.setItemAsync("token", token); // Store token in SecureStore
        } else {
            await SecureStore.deleteItemAsync("token"); // Clear token if null
        }
    } catch (error) {
        console.error("Error saving token:", error); // Log any error
    }
}

export async function getToken() {
    if (token !== null) {
        console.log("Returning cached token:", token); // Log the cached token
        return token;
    }

    try {
        token = await SecureStore.getItemAsync("token"); // Retrieve token from SecureStore
        console.log("Retrieved token from SecureStore:", token); // Log the retrieved token
    } catch (error) {
        console.error("Error retrieving token:", error); // Log any error
    }

    return token;
}