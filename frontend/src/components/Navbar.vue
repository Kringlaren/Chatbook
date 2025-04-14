<script setup>
import { ref, defineProps, watch } from "vue";
const props = defineProps({
    user: Object
});


const pp = ref("");
const name = ref("");

const urlBase = import.meta.env.VITE_URL_BASE;

watch(
    () => props.user,
    (user) => {
        if (user) {
            pp.value = user.profilePic;
            name.value = user.username;
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="navbar">
        <a v-if="pp" :href="name"><img class="profile" :src="urlBase + pp" alt="profilbild"></a>
        <a v-else href="login">Logga in</a>
    </div>
</template>

<style scoped>
    .navbar {
        display: flex;
        align-items: center;
        gap: 5vw;
        position: sticky;
        top: 0;
        width: 100%;
        height: var(--navbar-height);
        border: var(--default-border);
        border-width: 0 0 1px 0;
        background-color: var(--primary-color);
    }

    .profile {
        width: calc(var(--navbar-height) - 0.5vw);
        border-radius: 100%;
    }
</style>