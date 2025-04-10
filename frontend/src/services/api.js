import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_BASE,
    withCredentials: true, // Kan skicka kakor
});

export default api;