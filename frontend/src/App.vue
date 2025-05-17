<script setup>
import { watch } from "vue";
import { useUserStore, useAuthStore } from "./stores/";
import { applyColors } from "./services/styleService.js";

const userStore = useUserStore();
const authStore = useAuthStore();

// Så fort en inloggad användare hittas hämtar userStore nödvändig information, sätter färger om användaren har preferenser
watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await userStore.fetchUserPreferences();
      await userStore.fetchFollowedUsers();
      if (userStore.userPreferences) {
        applyColors(userStore.userPreferences);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view/>
</template>
