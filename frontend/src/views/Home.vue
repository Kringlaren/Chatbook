<script setup>
import { ref, onMounted } from "vue";
import Feed from "../components/Feed.vue";
import Navbar from "../components/Navbar.vue";
import MakePost from "../components/MakePost.vue";
import PostModal from "../components/PostModal.vue";
import FollowedList from "../components/FollowedList.vue";
import Scoreboard from "../components/Scoreboard.vue";
import gameImg from "../assets/images/zombiegame.png";

const expandedPost = ref(null);

const scoreboardTop = 10

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
            <div class="gamead">
                <img class="adimg" :src="gameImg">
                <Scoreboard :top="scoreboardTop"></Scoreboard>
                <a class="gamelink" href="game"><button>Spela Zombielabyrinten!</button></a>
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
    margin: 0 var(--default-gap);
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

.gamead {
    grid-column: 3; 
    float: right;
    margin: var(--default-gap) 0;
}
</style>