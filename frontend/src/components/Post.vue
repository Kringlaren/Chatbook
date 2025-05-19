<script setup>
import { usePostStore, useAuthStore } from "../stores";
import likedImg from '../assets/images/liked.png';
import likeImg from '../assets/images/like.png';
import commentImg from '../assets/images/comment.png';
import { formatNameForBackEnd } from "../services/format";

const postStore = usePostStore();
const authStore = useAuthStore();

const props = defineProps({
    post: Object,
    modal: { type: Boolean, default: false } 
});

const emit = defineEmits(['comment-clicked']);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = formatNameForBackEnd(props.post?.username);

// Uppdaterar front-end inlägget med svar från servern
const changeLikeOnPost = async () => {
    const res = await postStore.changeLikeOnPost(props.post.id);
    if (!res.error) {
        const updatedPost = res.post;
        Object.assign(props.post, updatedPost);
    }
};

const expandPost = async () => {
    emit('comment-clicked', props.post);
};
</script>

<template>
    <div :class="{ 'card' : !modal }" class="post" >
        <div class="profile">
            <img :src="backEndUrlBase + post.profile_pic" alt="Profilbild" class="profile-pic">
            <h3><router-link :to="'/user/' + usernameNoSpace">{{ post.username }}</router-link></h3>
            <p>-</p>
            <p>{{ post.created_at }}</p>
        </div>
        
        <p class="user-text">{{ post.content }}</p>
        
        <img v-if="post.image" :src="backEndUrlBase + post.image" alt="Inläggsbild" class="post-img ignore-padding">
        <div class="actions ignore-padding">
            <div>
                <span>{{ post.like_count }}</span>
                <button v-if="authStore.isLoggedIn" @click="changeLikeOnPost" class="icon-button"><img class="icon" :src="post.liked_by_user ? likedImg : likeImg" alt="gilla"></button>
                <img v-else class="icon" :src="likeImg" alt="gillningar">
            </div>
            <div>
                <span>{{ post.comment_count }}</span> 
                <button v-if="!modal" @click="expandPost" class="icon-button"><img class="icon" :src="commentImg" alt="kommentera"></button>
                <img v-else class="icon" :src="commentImg" alt="kommentarer">
            </div>
        </div>
    </div>
</template>

<style scoped>
.post {
    text-align: left;
    width: 100%;
    box-sizing: border-box;
}

.post-img {
    height: auto;
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
</style>