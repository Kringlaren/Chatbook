<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore.js";
const auth = useAuthStore();


const pp = ref("");

const urlBase = import.meta.env.VITE_URL_BASE;

onMounted(async () => {
    const user = await auth.fetchUser();
    console.log(user);
    pp.value = user.data.profilePic;
});
</script>

<template>
    <div class="navbar">
        <img v-if="pp" :src="urlBase + pp" alt="profilbild">
        <a v-else href="login">Logga in</a>
    </div>
</template>

<style scoped>
    .navbar {
        display: flex;
        position: sticky;
        top: 0;
        width: 100%;
        height: 4vw;
        border-width: 0 0 1px 0;
        border-style: solid;
        border-color: var(--border-color);
        background-color: var(--primary-color);
    }
</style>