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
            return this.handleAuthRequest("get", "/api/auth/me");
        },

        async logInUser(username, password) {
            return this.handleAuthRequest("post", "/api/auth/login", { username, password });
        },

        async registerUser(username, password) {
            return this.handleAuthRequest("post", "/api/auth/register", { username, password });
        },

        async handleAuthRequest(method, url, data = null) {
            this.loading = true;
            try {
              const res = await api[method](url, data);
              this.user = res.data;
              this.error = null;
              return res;
            } catch (error) {
              this.user = null;
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