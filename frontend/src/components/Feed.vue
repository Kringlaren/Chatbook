<script setup>
import { ref, onMounted } from "vue";
import Post from "./Post.vue";

import { usePostStore } from "../stores";
const postStore = usePostStore();


const posts = ref([]);
const errorMessage = ref("");

const emit = defineEmits(['comment-clicked']);

onMounted(async () => {
    const res = await postStore.fetchAllPosts();

    if (res.error) {
        errorMessage.value = res.error;
    } else {
        posts.value = res.data;
    }
});

const forwardCommentClicked = (post) => {
    emit('comment-clicked', post);
};
</script>

<template>
    <div v-if="posts" v-for="post in postStore.posts" :key="post.id">
        <Post :post="post" @comment-clicked="forwardCommentClicked"></Post>
    </div>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else>Laddar...</p>
    <div class="border">
        <p>Du har nått botten av flödet</p>
    </div>
</template>

<style scoped>
</style>