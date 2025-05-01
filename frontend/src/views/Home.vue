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
            <FollowedList></FollowedList>
            <div class="post-feed feed">
                <MakePost></MakePost>
                <Feed @comment-clicked="expandPost"></Feed>
            </div>
        </div>
        <PostModal v-if="expandedPost" @close="closePost" :post="expandedPost"></PostModal>
    </div>
</template>

<style scoped>
.main-content {
    display: grid;
    margin: var(--default-gap) 0;
}
.post-feed {
    grid-column: 2;
    width: 35vw;
    max-height: calc(99vh - var(--navbar-height) - var(--default-gap));
    padding: 0 1vw;
}
</style>