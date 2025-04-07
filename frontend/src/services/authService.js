import api from "./api.js";

export const logInUser = async (username, password) => {
    try {
        const res = await api.post("/api/auth/login", {
            username: username,
            password: password
        });
        return res;
    } catch (error) {
        return { error: error.response.data.message, status: error.response.status };
    }
}