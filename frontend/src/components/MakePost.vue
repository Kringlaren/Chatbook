<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";

const postStore = usePostStore();
const authStore = useAuthStore();

const content = ref("");
const img = ref(null);

const createPost = () => {
    postStore.createPost(content.value, img.value);
}

const imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        img.value = file;
    }
}
</script>

<template>
    <div class="border">
        <div v-if="authStore.isLoggedIn">
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
textarea {
    resize: none;
    width: 50%;
    height: 5vw;
}
</style>