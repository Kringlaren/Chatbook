<script setup>
import { usePostStore } from "../stores";
const postStore = usePostStore();
const props = defineProps({
    post: Object
});

const urlBase = import.meta.env.VITE_URL_BASE;

const usernameNoSpace = props.post.username.replace(/\s+/g, ".");

const changeLikeOnPost = async () => {
    postStore.changeLikeOnPost(props.post.id);
}

</script>

<template>
    <div class="post">
        <div class="contentpadding">
            <div class="profile">
                <img :src="urlBase + post.profile_pic" alt="Profilbild" class="profileimg">
                <h3><a :href="usernameNoSpace">{{ post.username }}</a></h3>
                <p>-</p>
                <p>{{ post.created_at }}</p>
            </div>
        
            <p>{{ post.content }}</p>
        </div>
        
        <img v-if="post.image" :src="urlBase + post.image" alt="Inläggsbild" class="postimg">
        <div class="actionspadding">
            <div class="like">
                <span>{{ post.like_count }}</span>
                <button @click="changeLikeOnPost" class="iconbutton"><img class="likeimg" src="../assets/images/like.png"></button>
            </div>
            
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

.contentpadding {
    padding: var(--default-padding) var(--default-padding) 0 var(--default-padding);
}
.actionspadding {
    padding: calc(var(--default-padding)/2) var(--default-padding);
}

.like {
    display: flex;
    align-items: center;
    gap: 0.5vw;
}
.likeimg {
    width: var(--icon-size);
}
</style>