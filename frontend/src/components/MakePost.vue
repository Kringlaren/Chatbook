<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";
import selectImg from "../assets/images/selectimg.png";

const postStore = usePostStore();
const authStore = useAuthStore();

const content = ref("");
const img = ref(null);
const imageInput = ref(null);
const imgName = ref("");

const createPost = async () => {
    const res = await postStore.createPost(content.value, img.value);
    content.value = "";
    img.value = null;
    if (res.error) {
        alert(res.error);
    }
}

const imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        img.value = file;
        imgName.value = file.name || "";
    }
}
</script>

<template>
    <div class="border">
        <div v-if="authStore.isLoggedIn">
            <h2>Skapa inlägg</h2>
            <form @submit.prevent="createPost()">
                <div class="inputrow">
                    <textarea v-model="content" name="postContent" placeholder="Dela din visdom med världen!" required></textarea>
                    <div class="imgupload">
                        <img class="bigicon" :src="selectImg" alt="Välj bild" id="imgUpload" @click="imageInput.click()" style="cursor: pointer">
                        <input type="file" ref="imageInput" @change="imageChange">
                        <label for="imgUpload" class="imglabel">{{ imgName }}</label>
                    </div>
                </div>
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

button {
    margin: var(--default-gap);
}
</style>