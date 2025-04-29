<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore, usePostStore, useAuthStore } from '../stores';
import Navbar from '../components/Navbar.vue';
import Post from '../components/Post.vue';
import PostModal from '../components/PostModal.vue';

const userStore = useUserStore();
const postStore = usePostStore();
const authStore = useAuthStore();

const isLoggedInUser = ref(false);

const route = useRoute();

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

const username = route.params.username;
const user = ref(null);
const userPosts = ref([]);
const bio = ref("");

const errorMessageUser = ref("");

const expandedPost = ref(null);

const bannerInput = ref(null);
const profilePicInput = ref(null);
const bioInput = ref("");

onMounted(async () => {
    const userRes = await userStore.fetchUserByUsername(username);
    if (userRes.error) {
        errorMessageUser.value = userRes.error;
    } else {
        user.value = userRes;
    }

    const postRes = await postStore.fetchPostsByUsername(username);

    if (!postRes.error) {
        userPosts.value = postRes;
    }

    if (authStore.isLoggedIn && authStore.user.id === user.value.id) {
        isLoggedInUser.value = true;
    }

    if (user.value.bio) {
        bio.value = user.value.bio;
    }
});

watch(
  () => authStore.isLoggedIn,
  async () => {
    if (authStore.isLoggedIn && authStore.user.id === user.value.id) {
        isLoggedInUser.value = true;
    } else {
        isLoggedInUser.value = false;
    }
  },
);

const expandPost = (post) => {
    expandedPost.value = post;
};
const closePost = () => {
    expandedPost.value = null;
};

const changeBanner = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;  
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await userStore.changeBanner(formData);
    if (!res.error) {
        user.value.banner_img = res.banner_img;
    }
};
const changeProfilePic = async (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;  
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await userStore.changeProfilePic(formData);
    if (!res.error) {
        user.value.profile_pic = res.profile_pic;
    }
};
const changeBio = async () => {
    const res = await userStore.changeBio(bio.value);
}
</script>

<template>
    <div class="scrollable">
        <Navbar></Navbar>
        <div v-if="user">
            <div class="container">
                <div v-if="authStore.isLoggedIn && authStore.user.id === user.id">
                    <img class="banner" :src="backEndUrlBase + user.banner_img" alt="banderoll" @click="bannerInput.click()" style="cursor: pointer">
                    <input type="file" ref="bannerInput" style="display: none" @change="changeBanner" accept="image/*">
                </div>
                <img v-else class="banner" :src="backEndUrlBase + user.banner_img" alt="banderoll">

                <div class="profile overbanner">
                    <div v-if="isLoggedInUser">
                        <img class="profilepic" :src="backEndUrlBase + user.profile_pic" alt="profilbild" @click="profilePicInput.click()" style="cursor: pointer">
                        <input type="file" ref="profilePicInput" style="display: none" @change="changeProfilePic">
                    </div>
                    <img v-else class="profilepic" :src="backEndUrlBase + user.profile_pic" alt="profilbild" accept="image/*">
                    <h1>{{ user.username }}</h1>
                </div>
            </div>
            <div class="layout">
                <div class="about">
                    <h3>Om {{ user.username }}</h3>
                    <textarea v-model="bio" v-if="user.bio" :disabled="!isLoggedInUser"></textarea>
                    <p v-else>{{ user.username }} har ingen beskrivning att visa</p>
                    <button v-if="isLoggedInUser" @click="changeBio">Spara</button>
                </div>

                <div class="posts feed">
                    <h2>{{ user.username }}s inlägg</h2>
                    <div v-if="userPosts.length !== 0" v-for="post in userPosts" :key="post.id">
                        <Post :post="post" @comment-clicked="expandPost"></Post>
                    </div>
                    <p v-else>{{ user.username }} har inga inlägg</p>
                </div>
            </div>
        </div>
        <p v-else-if="errorMessageUser">{{ errorMessageUser }}</p>
        <p v-else>Laddar...</p>
        <PostModal v-if="expandedPost" @close="closePost" :post="expandedPost"></PostModal>
    </div>
</template>


<style scoped>
.profilepic {
    width: 8vw;
    height: 8vw;
    object-fit: cover;
    border-radius: 100%;
}
.banner {
    width: 100%;
    height: 25vw;
    object-fit: cover;
}
.layout {
    display: grid;
    padding: var(--default-gap);
}
.container {
    position: relative;
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row: 1;
}
.overbanner {
    background-color: color-mix(in srgb, var(--primary-color) 90%, transparent);;
    position: absolute;
    left: 1vw;
    bottom: 1vw;
    padding: 1vw;
    border-radius: var(--default-border-radius);
}

.posts {
    grid-row: 2;
    grid-column: 2;
    width: 45vw;
}

.about {
    text-align: left;
    grid-row: 2;
    grid-column: 1;
    position: sticky;
    top: var(--navbar-height);
    max-height: 10vw;
    width: 35vw;
    padding: 1vw;
}
.about textarea {
    resize: none;
    width: 100%;
    padding: calc(var(--default-gap)/2);
    background-color: var(--primary-color);
}
</style>