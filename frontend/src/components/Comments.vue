<script setup>
import { ref, onMounted } from "vue";
import Comment from "./Comment.vue";
import { usePostStore } from '../stores';
const postStore = usePostStore();

const props = defineProps({
    post: Object
});

const comments = ref([]);
const errorMessage = ref("");

onMounted(async () => {
    const res = await postStore.fetchAllCommentsForPost(props.post.id);

    if (res.error) {
        errorMessage.value = res.error;
    } else {
        comments.value = res.data;
    }
});
</script>

<template>
    <div class="comments">
        <p>Kommentarer</p>
        <p v-if="errorMessage">{{ errorMessage }}</p>
    
        <div class="feed" v-if="comments.length !== 0" v-for="comment in comments" :key="comment.id">
            <Comment :comment="comment"></Comment>
        </div>
        <div v-else>
            <p>Här finns inga kommentarer än</p>
        </div>
    </div>
    
</template>

<style scoped>
    .feed{
        display: flex;
        flex-direction: column;
    }
    .comments {
        width: 98%;
        border: var(--default-border);
        border-radius: calc(var(--default-border-radius)/2);
        background-color: var(--primary-color);
        display: flex;
        flex-direction: column;
        align-self: center;

        border-top: none;
        border-start-end-radius: 0;
        border-start-start-radius: 0;
    }
</style>