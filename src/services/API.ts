import axios from "axios";


const API = axios.create({
    baseURL: "https://5q8v2jnkf0.execute-api.us-east-1.amazonaws.com/documents",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default API;

