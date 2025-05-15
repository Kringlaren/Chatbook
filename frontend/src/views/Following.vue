<script setup>
import FollowedList from "../components/FollowedList.vue";
import Navbar from "../components/Navbar.vue";
</script>

<template>
    <Navbar></Navbar>
    <div class="box flex-column">
        <h3>Du följer</h3>
        <FollowedList></FollowedList>
    </div>
</template>

<style scoped>
.box {
    margin: auto;
    height: var(--height-under-nav);
    width: 40vw;
}
@media only screen and (max-width: 1100px) {
    .box {
        width: 80vw;
    }
}
</style>