import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useUserStore = defineStore('user', {
    state: () => ({
      profileUser: null,
      error: null,
      loading: false
    }),

    actions: {
        async fetchUserByUsername(username) {
            const res = await this.handleUserRequest("get", "/api/user/" + username);
            if (!res.error) {
              this.profileUser = res.data;
            }
            return res;
        },

        async handleUserRequest(method, url, data = null, config = {}) {
            this.loading = true;
            try {
              let res;
              if (method === "post") {
                res = await api.post(url, data, config);
              } else if (method === "get") {
                res = await api.get(url, config);
              }
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