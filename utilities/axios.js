import axiosLib from "axios";
import { getToken } from "../services/TokenService";

const axios = axiosLib.create({
    baseURL: "https://wholesale.techjodo.xyz/api",
    headers: {
        Accept: "application/json",
    }
});

axios.interceptors.request.use(async (req) => {
    const token = await getToken();

    if (token !== null) {
        req.headers["Authorization"] = `Bearer ${token}`;
    }
    return req;
})

export default axios;