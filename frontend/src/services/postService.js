import api from "./api.js";

export const fetchPosts = async () => {
    try {
        const res = await api.get("/api/posts/all");
        res.data.forEach(post => {
            post.created_at = new Date(String(post.created_at)).toLocaleString("sv-SE", {
                dateStyle: "short",   // Kort datumformat
                timeStyle: "short"    // Kort tidsformat
            });
        });
        return res.data.reverse();
    } catch (error) {
        return { error: "Nätverksfel" };
    }
};