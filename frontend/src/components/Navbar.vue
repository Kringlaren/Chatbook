<script setup>
import { computed, ref } from "vue";
import { useAuthStore, useUserStore } from "../stores/";
import StyleSettings from "./StyleSettings.vue";
import settingsImg from '../assets/images/settings.png';
import settingsSelectedImg from '../assets/images/settingsselected.png';
import { formatNameForBackEnd } from "../services/format";

const authStore = useAuthStore();
const userStore = useUserStore();

// Computed uppdaterar variabler när de ändras
const pp = computed(() => userStore.userPreferences?.profile_pic || "");
const name = computed(() => authStore.user?.username || "");

const nameWithoutSpace = formatNameForBackEnd(name.value);

const urlBase = import.meta.env.VITE_URL_BASE;

const settingsVisible = ref(false);

const logOutUser = async () => {
    await authStore.logOutUser();
}
</script>

<template>
    <div class="navbar">
        <!--Vänster-->
        <div class="nav-left">
            <a href="/">Hem</a>
            <a href="following">Följer</a>
            <a href="game" class="narrow-screen-not-supported">Spel</a>
        </div>
        
        <!--Höger-->
        <div class="nav-right">
            <div class="flex-row">
                <div>
                    <a :href="'user/' + nameWithoutSpace" v-if="authStore.isLoggedIn" class="flex-row">
                        <p>{{ name }}</p>
                        <div class="flex-row"><img class="profile-pic" :src="urlBase + pp" alt="profilbild"></div>
                    </a>
                    <a v-else href="login">Logga in</a>
                </div>
                <button v-if="authStore.isLoggedIn" @click="logOutUser">Logga ut</button>
            </div>
            <div v-if="authStore.isLoggedIn">
                <button class="icon-button" @click="settingsVisible = !settingsVisible">
                    <img class="big-icon" :src="settingsVisible ? settingsSelectedImg : settingsImg">
                </button>
                <div v-if="settingsVisible" class="settings">
                    <StyleSettings></StyleSettings>
                </div>
            </div>
        </div>
        
        
    </div>
</template>

<style scoped>
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .settings {
        position: absolute;
        right: 0;
    }

    .nav-left, .nav-right {
        display: flex;
        gap: var(--nav-gap);
        align-items: center;
    }

    @media only screen and (max-width: 600px) {
        .navbar {
            flex-direction: column;
        }
        .settings {
            top: 5%;
            right: 25%;
        }
    }
</style>