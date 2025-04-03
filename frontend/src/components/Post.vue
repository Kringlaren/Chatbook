<script setup>
defineProps({
    post: Object
});
const urlBase = import.meta.env.VITE_URL_BASE;
</script>

<template>
    <div class="post">
        <div class="profile">
            <img :src="urlBase + post.profile_pic" alt="Profilbild" class="profileimg">
            <h3>{{ post.username }}</h3>
            <p>-</p>
            <p>{{ post.created_at }}</p>
        </div>
        
        <p>{{ post.content }}</p>
        <img v-if="post.image" :src="urlBase + post.image" alt="Inläggsbild" class="postimg">
        <p>Likes: {{ post.like_count }}</p>
    </div>
</template>

<style scoped>
.post {
  border: 1px solid #ddd;
  padding: 1.5vw;
  margin-bottom: 2vw;
  text-align: left;
  max-width: 50vw;
  border-radius: 10px;
}

.profile {
    display: flex;
    gap: 1vw;
    align-items: center;
}

.postimg {
  width: 100%;
  height: auto;
}
.profileimg {
    max-width: 4vw;
    max-height: 4vw;
    border-radius: 30px;
}
</style>