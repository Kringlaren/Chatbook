<script setup>
import { watch } from "vue";
import { useUserStore, useAuthStore } from "./stores/";
const userStore = useUserStore();
const authStore = useAuthStore();

// Så fort en användare hittas hämtar userStore nödvändig information
watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await authStore.fetchUser();
      await userStore.fetchUserPreferences();
      await userStore.fetchFollowedUsers();
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view/>
</template>
