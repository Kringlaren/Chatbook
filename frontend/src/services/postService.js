import api from "./api.js";

export const fetchPosts = async () => {
    try {
        const res = await api.get("/api/posts/all");
        return res.data;
    } catch (error) {
        return { error: "Nätverksfel" };
    }
};