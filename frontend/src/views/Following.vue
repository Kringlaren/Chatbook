<script setup>
import FollowedList from "../components/FollowedList.vue";
import Navbar from "../components/Navbar.vue";

</script>

<template>
    <Navbar></Navbar>
    <div class="box">
        <FollowedList></FollowedList>
    </div>
</template>

<style scoped>
.box {
    margin: auto;
    height: var(--height-under-nav);
    width: 40vw;
}
</style>