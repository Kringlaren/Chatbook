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
    <div class="scrollable followed-list">
        <h2>Följer</h2>
        <p v-if="!authStore.isLoggedIn"><a href="/login">Logga in</a> för att följa andra!</p>
        <p v-else-if="profiles.length === 0">Börja följa folk för att se dem här!</p>
        <div v-else="authStore.isLoggedIn" class="list">
            <div v-if="profiles.length !== 0" v-for="profile in profiles" :key="profile.id">
                <a :href="nameWithoutSpace(profile.username)" class="flex-row medium">
                    <img :src="backEndUrlBase + profile.profile_pic" alt="profilbild" class="profile-pic">
                    <span>{{ profile.username }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--default-gap);
    padding: 0 var(--default-padding); 
}

.followed-list {
    height: 100%;
    margin-top: var(--default-gap);
}
</style>