import { defineStore } from 'pinia';
import api from '../services/api.js';

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
      async createPost(userId, textContent, img) {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("textContent", textContent);
        formData.append("image", img);
        const res = this.handlePostRequest("post", "/api/posts/create", formData);
        if (!res.error) {
          this.posts.push(res.data);
        }
        return res;
      },

      async fetchAllPosts() {
        const res = await this.handlePostRequest("get", "/api/posts/all");
        if (!res.error) {
          this.posts = res.data;
        }
        return res;
      },

      async fetchPost(postId) {
        return this.handlePostRequest("get", "/api/posts/get/" + postId);
      },

      // Gillningar //
      ////////////////

      async likePost(postId) {
        const res = await this.handlePostRequest("post", "/api/posts/like/" + postId);
        if (!res.error) {
          const index = this.posts.findIndex(p => p.id === postId);
          if (index !== -1) {
            this.posts[index] = res.data;
          }
        }
      },

      async handlePostRequest(method, url, data = null) {
          this.loading = true;
          try {
            let res;
            if (method === "get") {
              res = await api.get(url);
            } else if (method === "post") {
              res = await api.post(url, data);
            }
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