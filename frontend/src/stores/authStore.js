import { defineStore } from 'pinia';
import api from '../services/api.js';

function getUserFromLocalStorage() {
    try {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        localStorage.removeItem("user"); // Ta bort korrupt data
        return null;
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: getUserFromLocalStorage(), // Endast id och användarnamn, mer användardata i userStore
        error: null,
        loading: false
    }),

    actions: {
        // Hämtar den inloggade användarens id och namn
        async fetchUser() {
            const res = await this.handleAuthRequest("get", "me", null, {
                // Så att cashen inte loggar in utloggad användare
                headers: {
                  "Cache-Control": "no-cache"
                }
            });
            if (res.error) {
                this.user = null;
                localStorage.removeItem("user");
                return { error: "Kunde inte hämta användardata" }
            }
            
            return res.data;
        },

        async logInUser(username, password) {
            const res = await this.handleAuthRequest("post", "login", { username, password });
            if (res.error) {
                if (res.status === 429) {
                    return { error: res.error }
                }
                return { error: "Kunde inte hitta användare" };   
            }

            this.user = res.data;
            localStorage.setItem("user", JSON.stringify(this.user));

            return res.data;
        },

        async registerUser(username, password) {
            const res = await this.handleAuthRequest("post", "register", { username, password });
            if (res.error) return { error: "Användare finns redan" }; // Behöver inte alltid vara sant men det behöver inte användare veta

            this.user = res.data;
            localStorage.setItem("user", JSON.stringify(this.user));

            return res.data; 
        },

        async logOutUser() {
            const res = await this.handleAuthRequest("post", "logout");
            if (res.error) return { error: "Kunde inte logga ut" };  

            this.user = null;
            localStorage.removeItem("user");

            return res.data;
        },

        async handleAuthRequest(method, url, data = null, config = {}) {
            this.loading = true;
            try {
                let res;
                if (method === "post") {
                  res = await api.post("/api/auth/" + url, data, config);
                } else if (method === "get") {
                  res = await api.get("/api/auth/" + url, config);
                }
                this.error = null;
                return res;
            } catch (error) {
                console.log(error);
                this.error = error.response?.data?.message || 'Något gick fel';
                return { error: this.error, status: error.response?.status };
            } finally {
                this.loading = false;
            }
        }
    },

    getters: {
        isLoggedIn: (state) => !!state.user
    }
});