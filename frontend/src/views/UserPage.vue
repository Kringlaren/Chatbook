<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores';

const userStore = useUserStore();

const route = useRoute();
const username = route.params.username;

const user = ref(null);
const errorMessage = ref("");

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

onMounted(async () => {
    const res = await userStore.fetchUserByUsername(username);

    if (res.error) {
        errorMessage.value = res.error;
    } else {
        user.value = res.data;
    }
});
</script>

<template>
    <div v-if="user">
        <h1>{{ user.username }}s sida</h1>
        <img :src="backEndUrlBase + user.profile_pic" alt="profilbild">
    </div>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else>Laddar...</p>
</template>