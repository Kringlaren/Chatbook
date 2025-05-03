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
    <div class="scrollable">
        <h2 class="header">Följer</h2>
        <div v-if="authStore.isLoggedIn" class="list">
            <div v-if="profiles.length !== 0" v-for="profile in profiles" :key="profile.id">
                <a :href="nameWithoutSpace(profile.username)" class="profile medium">
                    <img :src="backEndUrlBase + profile.profile_pic" alt="profilbild" class="profilepic">
                    <span>{{ profile.username }}</span>
                </a>
            </div>
        </div>
        <p v-else><a href="/login">Logga in</a> för att följa andra!</p>
    </div>
</template>

<style scoped>
.list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--default-gap);
    padding: 0 var(--default-gap); 
}

.followedlist {
    position: fixed;
    width: inherit;
}

.header {
    margin-top: 0;
}
</style>