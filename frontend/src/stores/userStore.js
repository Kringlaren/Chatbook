import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useUserStore = defineStore('user', {
    state: () => ({
      profileUser: null,
      userPreferences: [],
      error: null,
      loading: false
    }),

    actions: {
      async fetchUserByUsername(username) {
          const res = await this.handleUserRequest("get", "get/" + username);
          if (!res.error) {
            this.profileUser = res.data;
          }
          return res.data;
      },

      // Användarinställningar //
      ///////////////////////////

      async fetchUserPreferences() {
        const res = await this.handleUserRequest("get", "preferences");
        if (res.error) {
          return { error: "Kunde inte hämta preferenser" };
        }
        this.userPreferences = res.data.preferences;
        return res.data;
      },

      async changeBanner(formData) {
        const res = await this.handleUserRequest("post", "change-banner", formData);
        if (res.error) {
            return { error: "Kunde inte uppdatera banderollen" }; 
        }
        this.userPreferences.banner_img = res.data.banner_img;
        return res.data;
      },

      async changeProfilePic(formData) {
        const res = await this.handleUserRequest("post", "change-profile-pic", formData);
        if (res.error) {
            return { error: "Kunde inte uppdatera profilbilden" }; 
        }
        this.userPreferences.profile_pic = res.data.profile_pic;
        return res.data;   
      },

      async handleUserRequest(method, url, data = null, config = {}) {
        this.loading = true;
        try {
          let res;
          if (method === "post") {
            res = await api.post("/api/user/" + url, data, config);
          } else if (method === "get") {
            res = await api.get("/api/user/" + url, config);
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
});