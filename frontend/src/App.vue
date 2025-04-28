<script setup>
import { watch } from "vue";
import { useUserStore, useAuthStore } from "./stores/";
const userStore = useUserStore();
const authStore = useAuthStore();

// Så fort en användare hittas hämtar userStore preferenser
watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await userStore.fetchUserPreferences();
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view/>
</template>
