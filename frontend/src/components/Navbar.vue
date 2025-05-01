<script setup>
import { computed } from "vue";
import { useAuthStore, useUserStore } from "../stores/";
const authStore = useAuthStore();
const userStore = useUserStore();

// Computed uppdaterar variabler när de ändras
const pp = computed(() => userStore.userPreferences?.profile_pic || "");
const name = computed(() => authStore.user?.username || "");

const nameWithoutSpace = name.value.replace(/\s/, ".");

const urlBase = import.meta.env.VITE_URL_BASE;


const logOutUser = async () => {
    await authStore.logOutUser();
}
</script>

<template>
    <div class="navbar">
        <a href="/" class="left">Hem</a>
        <div class="profile right">
            <div>
                <a :href="nameWithoutSpace" v-if="authStore.isLoggedIn" class="profile">
                    <p>{{ name }}</p>
                    <div class="profile"><img class="profilepic" :src="urlBase + pp" alt="profilbild"></div>
                </a>
                <a v-else href="login">Logga in</a>
            </div>
            <button v-if="authStore.isLoggedIn" @click="logOutUser">
                Logga ut
            </button>
        </div>
        
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
        padding: var(--default-padding);
        box-sizing: border-box;
        font-size: var(--medium-font-size);
        z-index: 5;
    }

    .profilepic {
        width: calc(var(--navbar-height) - 0.5vw);
        height: calc(var(--navbar-height) - 0.5vw);
        object-fit: cover;
        border-radius: 100%;
    }
</style>