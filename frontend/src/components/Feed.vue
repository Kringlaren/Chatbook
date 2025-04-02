<script setup>
import { ref, onMounted } from "vue";
import Post from "./Post.vue";
import api from "../services/api.js";

import {fetchPosts} from "../services/postService.js";

const posts = ref([]);
const errorMessage = ref("");

onMounted(async () => {
    const res = await fetchPosts();

    if (res.error) {
        errorMessage.value = res.error;
    } else {
        posts.value = res;
    }
});
</script>

<template>
    <h1>Flöde</h1>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <div v-for="post in posts" :key="post.id">
        <Post :post="post"></Post>
    </div>
</template>