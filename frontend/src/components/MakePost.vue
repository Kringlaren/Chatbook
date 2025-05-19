<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";
import selectImg from "../assets/images/selectimg.png";

const postStore = usePostStore();
const authStore = useAuthStore();

const textContent = ref("");
const img = ref(null);
const imageInput = ref(null);
const imgName = ref("");

const createPost = async () => {
    const res = await postStore.createPost(textContent.value, img.value);
    textContent.value = "";
    img.value = null;
    imgName.value = "";
    if (res.error) {
        alert(res.error);
    }
};

const imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        img.value = file;
        imgName.value = file.name || "";
    }
};
</script>

<template>
    <div class="card">
        <div v-if="authStore.isLoggedIn">
            <h2>Skapa inlägg</h2>
            <form @submit.prevent="createPost()">
                <div class="input-row">
                    <textarea v-model="textContent" name="postContent" maxlength="255" required></textarea>
                    <div class="img-upload">
                        <img class="big-icon" :src="selectImg" alt="Välj bild" @click="imageInput.click()" style="cursor: pointer">
                        <input type="file" ref="imageInput" id="imgUpload" @change="imageChange" accept="image/*">
                        <label for="imgUpload" class="img-label">{{ imgName }}</label>
                    </div>
                </div>
                <button type="submit">Lägg upp!</button>   
            </form>
        </div>
        <div v-else>
            <h2><router-link to="/login">Logga in</router-link> för att skapa inlägg!</h2>
        </div>
    </div>
</template>

<style scoped>
textarea {
    resize: none;
    width: 50%;
    height: 5vw;
    font-size: var(--small-font-size);
    font-family: var(--font-family);
}

button {
    margin: var(--default-gap);
}
</style>