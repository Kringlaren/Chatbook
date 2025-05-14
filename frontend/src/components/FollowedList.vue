<script setup>
import { watch, ref, onMounted } from "vue";
import { useUserStore, useAuthStore } from "../stores";
import { formatNameForBackEnd } from "../services/format";
const userStore = useUserStore();
const authStore = useAuthStore();

const props = defineProps({
    username: String
});

const profiles = ref([]);

const backEndUrlBase = import.meta.env.VITE_URL_BASE;

onMounted(async () => {
    if (props.username) {
        const res = await userStore.fetchFollowedUsers(props.username);
        profiles.value = res.users;
        console.log("annan", profiles.value);
    }
});

watch(
    () => userStore.followedUsers,
    async (users) => {
        if (users && !props.username) {
            profiles.value = users;
            console.log("du", profiles.value);
        }
    },
); 
</script>

<template>
    <div class="scrollable followed-list">
        <div v-if="!props.username">
            <p v-if="!authStore.isLoggedIn"><a href="/login">Logga in</a> för att följa andra!</p>
            <p v-else-if="profiles.length === 0">Börja följa folk för att se dem här!</p>
        </div>
        
        <div class="list">
            <div v-if="profiles.length !== 0" v-for="profile in profiles" :key="profile.id">
                <a :href="formatNameForBackEnd(profile.username)" class="flex-row medium">
                    <img :src="backEndUrlBase + profile.profile_pic" alt="profilbild" class="profile-pic">
                    <span>{{ profile.username }}</span>
                </a>
            </div>
            <p v-else>{{ props.username }} följer ingen</p>
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
    height: inherit;
}
</style>