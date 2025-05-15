<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore, usePostStore, useAuthStore } from '../stores';
import Navbar from '../components/Navbar.vue';
import Post from '../components/Post.vue';
import PostModal from '../components/PostModal.vue';
import FollowedList from '../components/FollowedList.vue';

const userStore = useUserStore();
const postStore = usePostStore();
const authStore = useAuthStore();

const route = useRoute();

const isLoggedInUser = ref(false);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

const username = route.params.username;
const user = ref(null);
const userPosts = ref([]);
const bio = ref("");

const originalBio = ref("");
const followOrUnfollow = ref("");

const errorMessage = ref("");

const expandedPost = ref(null);

const bannerInput = ref(null);
const profilePicInput = ref(null);

// Hämtar användardata, inlägg, följstatus och om användaren är den inloggade användaren
onMounted(async () => {
    const userRes = await userStore.fetchUserByUsername(username);
    
    if (userRes.error) {
        errorMessage.value = userRes.error;
    } else {
        user.value = userRes.user;
    }
    const postRes = await postStore.fetchPostsByUsername(username);

    if (!postRes.error) {
        userPosts.value = postRes;
    }

    if (authStore.isLoggedIn && authStore.user.id === user.value.id) {
        isLoggedInUser.value = true;
    }

    if (user.value.bio) {
        originalBio.value = user.value.bio;
        bio.value = user.value.bio;
    }

    if (user.value.followed_by_user === 1) {
        followOrUnfollow.value = "Avfölj";
    } else {
        followOrUnfollow.value = "Följ";
    }
});

// Uppdaterar isLoggedInUser om man loggar ut/in
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
    if (originalBio.value === bio.value) return;

    const res = await userStore.changeBio(bio.value);
    if (res.error) {
        alert(res.error);
    }
};

const changeFollow = async () => {
    const res = await userStore.changeFollow(user.value.username);
    if (res.error) {
        alert(res.error);
    }
    if (res.user.followed_by_user) {
        followOrUnfollow.value = "Avfölj";
        user.value.followers_count++;
    } else {
        followOrUnfollow.value = "Följ";
        user.value.followers_count--;
    }
};
</script>

<template>
    <div class="scrollable">
        <Navbar></Navbar>
        <div v-if="user" class="user-page">
            <!--Banner-->
            <div class="container banner-container">
                <div v-if="authStore.isLoggedIn && authStore.user.id === user.id">
                    <img class="banner" :src="backEndUrlBase + user.banner_img" alt="banderoll" @click="bannerInput.click()" style="cursor: pointer">
                    <input type="file" ref="bannerInput" @change="changeBanner" accept="image/*">
                </div>
                <img v-else class="banner" :src="backEndUrlBase + user.banner_img" alt="banderoll">

                <!--Profil-->
                <div class="flex-row over left-pos">
                    <div v-if="isLoggedInUser">
                        <img class="big-profile-pic" :src="backEndUrlBase + user.profile_pic" alt="profilbild" @click="profilePicInput.click()" style="cursor: pointer">
                        <input type="file" ref="profilePicInput" @change="changeProfilePic" accept="image/*">
                    </div>
                    <img v-else class="big-profile-pic" :src="backEndUrlBase + user.profile_pic" alt="profilbild">
                    <h1>{{ user.username }}</h1>
                </div>
                <!--Följare-->
                <div class="over right-pos">
                    <div>
                        <span class="follow-count">{{ user.followers_count }} följare</span>
                        <button v-if="!isLoggedInUser && authStore.isLoggedIn" class="follow-butn" @click="changeFollow">{{ followOrUnfollow }}</button>
                    </div>
                </div>
            </div>
            <!--Main-->
            <div class="layout">
                <div class="info">
                    <!--Om-->
                    <div class="about">
                        <h3>Om {{ user.username }}</h3>
                        <textarea v-model="bio" v-if="user.bio || isLoggedInUser" :disabled="!isLoggedInUser" maxlength="255"></textarea>
                        <p v-else>{{ user.username }} har ingen beskrivning att visa</p>
                        <button v-if="isLoggedInUser" @click="changeBio">Spara</button>
                    </div>
                    <!--Följer-->
                    <div class="following flex-column">
                        <h3>{{ user.username }} följer</h3>
                        <FollowedList :username="user.username"></FollowedList>
                    </div>
                </div>
                <!--Inlägg-->
                <div class="posts flex-column">
                    <h2>{{ user.username }}s inlägg</h2>
                    <div v-if="userPosts.length !== 0" v-for="post in userPosts" :key="post.id">
                        <Post :post="post" @comment-clicked="expandPost"></Post>
                    </div>
                    <p v-else>{{ user.username }} har inga inlägg</p>
                    <div class="card">{{ user.username }} gick med {{ user.created_at }}</div>
                </div>
            </div>
        </div>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>
        <p v-else>Laddar...</p>
        <PostModal v-if="expandedPost" @close="closePost" :post="expandedPost"></PostModal>
    </div>
</template>


<style scoped>
h3, h2 {
    margin-top:0;
}

.user-page {
    background-color: var(--primary-color);
    color: var(--text-color);
}

.banner {
    width: 100%;
    height: 25vw;
    object-fit: cover;
}
.layout {
    display: grid;
    grid-template-columns: 2fr 3fr;
    padding: var(--default-gap);
    padding-bottom: 0;
}
.banner-container {
    grid-column: 1 3;
    grid-row: 1;
}

.right-pos {
    right: 1vw;
    bottom: 1vw;
}
.left-pos {
    left: 1vw;
    bottom: 1vw;
}

.follow-butn {
    font-size: var(--small-font-size);
    margin-left: 1vw;
}
.follow-count {
    font-size: var(--small-font-size);
}

.posts {
    grid-row: 2;
    grid-column: 2;
    width: 45vw;
    margin: var(--default-gap) 0;
}

.info {
    text-align: left;
    padding: 1vw;
    grid-row: 2;
    grid-column: 1;
    position: sticky;
    height: var(--height-under-nav);
    top: var(--navbar-height);
    display: flex;
    flex-direction: column;
    width: 90%;
}

.about {
    height: 15vw;
}
.about textarea {
    resize: none;
    width: 30vw;
    padding: calc(var(--default-gap)/2);
    background-color: var(--primary-color);
    font-size: var(--small-font-size);
    font-family: var(--font-family);
}

.following {
    height: calc(100vh - var(--navbar-height) - var(--default-gap) - 15vw);
    width: 30vw;
}
@media only screen and (max-width: 1100px) {
    .right-pos, .left-pos {
        bottom: 2vw;
    }

    .layout {
        grid-template-columns: 1fr 2fr;
    }

    .about {
        height: 25vw;
    }
    .following {
        height: calc(100vh - var(--navbar-height) - var(--default-gap) - 25vw);
    }
    .posts {
        width: 55vw;
    }
}

@media only screen and (max-width: 600px) {
    h1 {
        font-size: var(--medium-font-size);
    }
    .banner-container {
        grid-column: 1;
    }
    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .info {
        position: inherit;
        margin: 0 auto;
        height: fit-content;
    }
    .posts {
        grid-column: 1;
        grid-row: 3;
        width: 80vw;
    }
    .about {
        height: fit-content;
    }
    .about textarea {
        width: 75vw;
    }
    .following {
        display: none;
    }
}
</style>