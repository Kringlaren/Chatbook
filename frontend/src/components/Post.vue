<script setup>
defineProps({
    post: Object
});
const urlBase = import.meta.env.VITE_URL_BASE;
</script>

<template>
    <div class="post">
        <h3>{{ post.username }}</h3>
        <p>{{ post.content }}</p>
        <img v-if="post.image" :src="urlBase + post.image" alt="Inläggsbild">
    </div>
</template>

<style scoped>
</style>