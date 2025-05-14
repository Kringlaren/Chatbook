<script setup>
import FollowedList from "../components/FollowedList.vue";
import Navbar from "../components/Navbar.vue";

</script>

<template>
    <Navbar></Navbar>
    <div class="box flex-column">
        <h3>Du följer</h3>
        <FollowedList class="flex-list"></FollowedList>
    </div>
</template>

<style scoped>
.box {
    margin: auto;
    height: var(--height-under-nav);
    width: 40vw;
}
</style>