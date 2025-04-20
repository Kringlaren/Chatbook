<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores";
import likedImg from '../assets/images/liked.png';
import likeImg from '../assets/images/like.png';
import commentImg from '../assets/images/comment.png';
const postStore = usePostStore();
const authStore = useAuthStore();
const props = defineProps({
    post: Object,
    modal: { type: Boolean, default: false } 
});
const emit = defineEmits(['comment-clicked']);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = props.post.username.replace(/\s+/g, ".");

let liked = ref(props.post.likedByUser);

const changeLikeOnPost = async () => {
    const res = await postStore.changeLikeOnPost(props.post.id);
    if (!res.error) {
        liked.value = res.data.liked;
    }
}

const expandPost = async () => {
    emit('comment-clicked', props.post);
}

</script>

<template>
    <div :class="{ 'border' : !modal }" class="post" >
        <div class="contentpadding">
            <div class="profile">
                <img :src="backEndUrlBase + post.profile_pic" alt="Profilbild" class="profileimg">
                <h3><a :href="usernameNoSpace">{{ post.username }}</a></h3>
                <p>-</p>
                <p>{{ post.created_at }}</p>
            </div>
        
            <p>{{ post.content }}</p>
        </div>
        
        <img v-if="post.image" :src="backEndUrlBase + post.image" alt="Inläggsbild" class="postimg">
        <div class="actions">
            <div>
                <span>{{ post.like_count }}</span>
                <button v-if="authStore.isLoggedIn" @click="changeLikeOnPost" class="iconbutton"><img class="icon" :src="liked ? likedImg : likeImg" alt="gilla"></button>
                <img v-else class="icon" :src="likeImg" alt="gillningar">
            </div>
            <div>
                <span>{{ post.comment_count }}</span> 
                <button v-if="authStore.isLoggedIn && !modal" @click="expandPost" class="iconbutton"><img class="icon" :src="commentImg" alt="kommentera"></button>
                <img v-else class="icon" :src="commentImg" alt="kommentarer">
            </div>
        </div>
    </div>
</template>

<style scoped>
.post {
    text-align: left;
    width: 100%;
    border-radius: calc(var(--default-border-radius)/2);
    background-color: var(--primary-color);
}
.border {
    border: var(--default-border);
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

.contentpadding {
    padding: var(--default-padding) var(--default-padding) 0 var(--default-padding);
}
.actions {
    display: flex;
    gap: var(--default-gap);
    padding: calc(var(--default-padding)/2) var(--default-padding);
}
.actions div {
    display: flex;
    align-items: center;
    gap: 0.2vw;
}

.icon {
    width: var(--icon-size);
}
</style>