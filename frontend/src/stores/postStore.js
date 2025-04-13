import { defineStore } from 'pinia';
import api from '../services/api.js';

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        error: null,
        loading: false
    }),

    actions: {
        async createPost(userId, textContent, img) {
            return this.handlePostRequest("post", "/api/posts/create", { userId, textContent, img });
        },

        async fetchAllPosts() {
            return this.handlePostRequest("get", "/api/posts/all");
        },

        async fetchPost(postId) {
            return this.handlePostRequest("post", "/api/posts/get/" + postId);
        },

        async handlePostRequest(method, url, data = null) {
            this.loading = true;
            try {
              const res = await api[method](url, data);
              this.posts = Array.isArray(res.data) ? res.data : [res.data];
              this.error = null;
              return res;
            } catch (error) {
              this.posts = [];
              this.error = error.response?.data?.message || 'Något gick fel';
              return { error: this.error, status: error.response?.status }
            } finally {
              this.loading = false;
            }
          }
    },
});