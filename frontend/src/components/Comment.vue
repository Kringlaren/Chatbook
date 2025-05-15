<script setup>
import { formatNameForBackEnd } from '../services/format';
const props = defineProps({
    comment: Object,
});

const urlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = formatNameForBackEnd(props.comment?.username);
</script>

<template>
    <div class="comment">
        <div class="content-padding">
            <div class="profile">
                <img :src="urlBase + comment.profile_pic" alt="Profilbild" class="small-profile-pic">
                <h3><a :href="'user/' + usernameNoSpace">{{ comment.username }}</a></h3>
                <p>-</p>
                <p>{{ comment.created_at }}</p>
            </div>
        
            <p class="user-text">{{ comment.content }}</p>
            <img v-if="comment.image" :src="urlBase + comment.image" alt="Inläggsbild" class="comment-img">
        </div>
    </div>
</template>

<style scoped>

p {
    margin: 0;
}

.comment {
    text-align: left;
    width: 100%;
    background-color: var(--primary-color);
    border-radius: calc(var(--default-border-radius)/2);
    margin-bottom: var(--default-gap);
}

.comment-img {
    width: 20%;
}

.content-padding {
    padding: var(--default-padding) var(--default-padding) 0 var(--default-padding);
}
</style>