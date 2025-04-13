<script setup>
import { ref, onMounted } from "vue";
import Feed from "../components/Feed.vue";
import Navbar from "../components/Navbar.vue";
import MakePost from "../components/MakePost.vue";
import { useAuthStore } from "../stores/authStore.js";
const auth = useAuthStore();

const user = ref(null);

onMounted(async () => {
    const res = await auth.fetchUser();
    if (!res.error) {
        user.value = res.data;
    }
});
</script>

<template>
    <Navbar :user="user"></Navbar>
    <div class="main-content">
        <div>
            Vänner
        </div>
        <div class="post-feed">
            <MakePost :user="user"></MakePost>
            <Feed></Feed>
        </div>
    </div>
    
    
</template>

<style scoped>
.main-content {
    display: grid;
}
.post-feed {
    grid-column: 2;
    display: flex;
    flex-direction: column;
    gap: 2vw;
    width: 35vw;
}
</style>