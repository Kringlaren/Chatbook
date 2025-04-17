import { defineStore } from 'pinia';
import api from '../services/api.js';
import { useAuthStore } from "./";

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        error: null,
        loading: false
    }),

    actions: {
      // Inlägg //
      ////////////

      // Formdata för att filer ska kunna laddas upp
      async createPost(textContent, img = null) {
        const formData = new FormData();
        formData.append("userId", this.getUserId());
        formData.append("textContent", textContent);
        formData.append("image", img);
        const res = this.handlePostRequest("post", "create", formData);
        if (!res.error) {
          this.posts.push(res.data.posts);
        }
        return res;
      },

      async fetchAllPosts() {
        const res = await this.handlePostRequest("get", "all");
        if (!res.error) {
          this.posts = res.data.posts;
        }
        return res;
      },

      async fetchPost(postId) {
        return this.handlePostRequest("get", "get/" + postId);
      },

      // Gillningar //
      ////////////////

      async changeLikeOnPost(postId) {
        const userId = this.getUserId();
        const res = await this.handlePostRequest("post", "like", {userId, postId});
        if (!res.error) {
          const index = this.posts.findIndex(p => p.id === postId);
          if (index !== -1) {
            this.posts[index] = res.data.posts[0];
          }
        }
        return res;
      },

      async handlePostRequest(method, url, data = null) {
          this.loading = true;
          try {
            let res;
            if (method === "get") {
              res = await api.get("/api/posts/" + url);
            } else if (method === "post") {
              res = await api.post("/api/posts/" + url, data);
            }
            this.error = null;
            return res;
          } catch (error) {
            this.error = error.response?.data?.message || 'Något gick fel';
            return { error: this.error, status: error.response?.status }
          } finally {
            this.loading = false;
          }
      },

      getUserId() {
        const authStore = useAuthStore();
        return authStore.user?.id || null;
      }
    },

    
});