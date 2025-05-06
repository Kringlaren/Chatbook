<script setup>
import { ref, onMounted } from "vue";
import Feed from "../components/Feed.vue";
import Navbar from "../components/Navbar.vue";
import MakePost from "../components/MakePost.vue";
import PostModal from "../components/PostModal.vue";
import FollowedList from "../components/FollowedList.vue";

const expandedPost = ref(null);

const expandPost = (post) => {
    expandedPost.value = post;
};
const closePost = () => {
    expandedPost.value = null;
}
</script>

<template>
    <div class="scrollable">
        <Navbar></Navbar>
        <div class="main-content">
            <div class="followed">
                <FollowedList></FollowedList>
            </div>
            <div class="post-feed feed">
                <MakePost></MakePost>
                <Feed @comment-clicked="expandPost"></Feed>
            </div>
            <div style="grid-column: 3; float: right;">

            </div>
        </div>
        <PostModal v-if="expandedPost" @close="closePost" :post="expandedPost"></PostModal>
    </div>
</template>

<style scoped>
.main-content {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: calc(var(--default-gap)*3);
}
.post-feed {
    grid-column: 2;
    margin: var(--default-gap) 0;
}
.followed {
    grid-column: 1;
    position: fixed;
    height: calc(100vh - var(--navbar-height) - var(--default-gap));
}
</style>