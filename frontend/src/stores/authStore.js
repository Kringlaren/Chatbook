import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: JSON.parse(localStorage.getItem("user")) || null,
      error: null,
      loading: false
    }),

    actions: {
        async fetchUser() {
            const res = await this.handleAuthRequest("get", "/api/auth/me", null, {
              // Så att cashen inte loggar in utloggad användare
              headers: {
                "Cache-Control": "no-cache"
              }
            });
            if (res.error) {
              this.user = null;
              localStorage.removeItem("user");
            }
            return res;
        },

        async logInUser(username, password) {
            return this.handleAuthRequest("post", "/api/auth/login", { username, password });
        },

        async registerUser(username, password) {
            return this.handleAuthRequest("post", "/api/auth/register", { username, password });
        },

        async logOutUser() {
            const res = await this.handleAuthRequest("post", "/api/auth/logout");
            if (!res.error) {
              this.user = null;
              localStorage.removeItem("user");
            }
            return res;
        },

        async handleAuthRequest(method, url, data = null, config = {}) {
            this.loading = true;
            try {
              let res;
              if (method === "post") {
                res = await api.post(url, data, config);
              } else if (method === "get") {
                res = await api.get(url, config);
              }
              
              this.user = res.data;
              localStorage.setItem("user", JSON.stringify(this.user));
              this.error = null;
              return res;
            } catch (error) {
              this.error = error.response?.data?.message || 'Något gick fel';
              return { error: this.error, status: error.response?.status }
            } finally {
              this.loading = false;
            }
          }
    },

    getters: {
        isLoggedIn: (state) => !!state.user
    }
});