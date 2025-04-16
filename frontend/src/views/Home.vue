<script setup>
import { onMounted } from "vue";
import Feed from "../components/Feed.vue";
import Navbar from "../components/Navbar.vue";
import MakePost from "../components/MakePost.vue";
import { useAuthStore } from "../stores/authStore.js";
const auth = useAuthStore();

onMounted(async () => {
    await auth.fetchUser();
});
</script>

<template>
    <Navbar></Navbar>
    <div class="main-content">
        <div>
            Vänner
        </div>
        <div class="post-feed">
            <MakePost></MakePost>
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