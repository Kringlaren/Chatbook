<script setup>
import { watch, ref } from "vue";
import { useUserStore, useAuthStore } from "../stores";
const userStore = useUserStore();
const authStore = useAuthStore();

const profiles = ref([]);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

const nameWithoutSpace = (name) => {
    return name.replace(/\s/, ".");
}


watch(
    () => userStore.followedUsers,
    async (users) => {
        if (users) {
            profiles.value = users;
        }
    },
); 
</script>

<template>
    <div>
        <h2>Följer</h2>
        <div v-if="authStore.isLoggedIn" class="list">
            <div v-if="profiles.length !== 0" v-for="profile in profiles" :key="profile.id">
                <a :href="nameWithoutSpace(profile.username)" class="profile">
                    <span>{{ profile.username }}</span>
                    <img :src="backEndUrlBase + profile.profile_pic" alt="profilbild" class="profilepic">
                </a>
            </div>
        </div>
        <p v-else><a href="/login">Logga in</a> för att följa andra!</p>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>