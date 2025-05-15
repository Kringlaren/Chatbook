<script setup>
import { watch, ref, onMounted } from "vue";
import { useUserStore, useAuthStore } from "../stores";
import { formatNameForBackEnd } from "../services/format";

const userStore = useUserStore();
const authStore = useAuthStore();

// Ska skickas med om det är någon annan än den inloggade användaren
const props = defineProps({
    username: String
});

const followingProfiles = ref([]);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

// Om det är listan för den inloggade användaren uppdateras följarlistan automatiskt vid uppdateringar av userStore
watch(
    () => userStore.followedUsers,
    async (users) => {
        if (users && !props.username) {
            followingProfiles.value = users;
        }
    },
); 

// Om det är listan för en annan användare uppdateras följarlistan vid inläsning av sidan
onMounted(async () => {
    if (props.username) {
        const res = await userStore.fetchFollowedUsers(props.username);
        followingProfiles.value = res.users;
    }
});
</script>

<template>
    <div class="scrollable followed-list">
        <div v-if="!props.username">
            <p v-if="!authStore.isLoggedIn"><a href="/login">Logga in</a> för att följa andra!</p>
            <p v-else-if="followingProfiles.length === 0">Börja följa folk för att se dem här!</p>
        </div>
        
        <div class="list flex-column">
            <div v-if="followingProfiles.length !== 0" v-for="profile in followingProfiles" :key="profile.id">
                <a :href="'user/' + formatNameForBackEnd(profile.username)" class="profile follow">
                    <img :src="backEndUrlBase + profile.profile_pic" alt="profilbild" class="profile-pic">
                    <span class="name">{{ profile.username }}</span>
                </a>
            </div>
            <p v-else-if="props.username">{{ props.username }} följer ingen</p>
        </div>
    </div>
</template>

<style scoped>
.followed-list {
    height: inherit;
}

.list {
    justify-content: center;
    padding: 0 var(--default-padding); 
}
</style>