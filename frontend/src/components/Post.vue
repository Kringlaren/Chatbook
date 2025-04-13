<script setup>
const props = defineProps({
    post: Object
});

const urlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = props.post.username.replace(/\s+/g, ".");
</script>

<template>
    <div class="post">
        <div class="padding">
            <div class="profile">
                <img :src="urlBase + post.profile_pic" alt="Profilbild" class="profileimg">
                <h3><a :href="usernameNoSpace">{{ post.username }}</a></h3>
                <p>-</p>
                <p>{{ post.created_at }}</p>
            </div>
        
            <p>{{ post.content }}</p>
        </div>
        
        <img v-if="post.image" :src="urlBase + post.image" alt="Inläggsbild" class="postimg">
        <div class="padding">
            <p>Likes: {{ post.like_count }}</p>
        </div>
        
    </div>
</template>

<style scoped>
.post {
  border: var(--default-border);
  text-align: left;
  width: 100%;
  border-radius: var(--default-border-radius);
  
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
    border-radius: 100%;
}

.padding {
    padding: var(--default-padding);
}
</style>