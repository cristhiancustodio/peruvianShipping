import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

const API = axios.create({
    baseURL: "https://5q8v2jnkf0.execute-api.us-east-1.amazonaws.com/documents",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

// 🔐 Interceptor para agregar token antes de cada request
API.interceptors.request.use(async (config) => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken.toString();

        config.headers["Authorization"] = `Bearer ${token}`;
    } catch (err) {
        console.error("Error obteniendo token:", err);
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
