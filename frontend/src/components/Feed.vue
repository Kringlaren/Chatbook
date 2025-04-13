<script setup>
import { ref, onMounted } from "vue";
import Post from "./Post.vue";
import api from "../services/api.js";

import { usePostStore } from "../stores/postStore.js";
const postStore = usePostStore();


const posts = ref([]);
const errorMessage = ref("");

onMounted(async () => {
    const res = await postStore.fetchAllPosts();

    if (res.error) {
        errorMessage.value = res.error;
    } else {
        posts.value = res.data;
    }
});
</script>

<template>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div class="feed" v-for="post in posts" :key="post.id">
        <Post :post="post"></Post>
    </div>
</template>

<style scoped>
    .feed{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>