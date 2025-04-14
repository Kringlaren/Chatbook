<script setup>
import { ref, defineProps, watch } from "vue";
import { usePostStore } from "../stores/PostStore.js";

const props = defineProps({
    user: Object 
});

const postStore = usePostStore();

const userId = ref(0);
const content = ref("");
const img = ref(null);

watch(
    () => props.user,
    (user) => {
        if (user) {
            userId.value = user.id;
        }
    },
    { immediate: true }
);

const createPost = () => {
    postStore.createPost(userId.value, content.value, img);
}

const imageChange = (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    if (file) {
        img.value = file;
    }
}
</script>

<template>
    <div class="panel">
        <div v-if="user">
            <h2>Skapa inlägg</h2>
            <form @submit.prevent="createPost()">
                <textarea v-model="content" name="postContent" placeholder="Dela din visdom med världen!" required></textarea>
                <br>
                <input @change="imageChange" type="file" accept="image/*">
                <button type="submit">Lägg upp!</button>   
            </form>
        </div>
        <div v-else>
            <h2><a href="login">Logga in</a> för att skapa inlägg!</h2>
        </div>    

        
    </div>
</template>

<style scoped>
.panel {
    border: var(--default-border);
    border-radius: var(--default-border-radius);
}

textarea {
    resize: none;
    width: 50%;
    height: 5vw;
}
</style>