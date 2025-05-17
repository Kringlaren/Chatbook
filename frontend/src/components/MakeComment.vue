<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";
import selectImg from "../assets/images/selectimg.png";

const postStore = usePostStore();
const authStore = useAuthStore();

const props = defineProps({
    post: Object
});

const textContent = ref("");
const img = ref(null);
const imageInput = ref(null);
const imgName = ref("");

const createComment = async () => {
    const res = await postStore.createComment(props.post.id, textContent.value, img.value);
    textContent.value = "";
    img.value = null;
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
}
</script>

<template>
    <div>
        <div v-if="authStore.isLoggedIn">
            <form @submit.prevent="createComment()">
                <div class="input-row">
                    <input type="text" v-model="textContent" name="textContent" placeholder="Sprid dina åsikter!" required/>
                    <div class="img-upload">
                        <img class="icon" :src="selectImg" alt="Välj bild" @click="imageInput.click()">
                        <input type="file" ref="imageInput" @change="imageChange" accept="image/*">
                        <label for="imgUpload" class="img-label">{{ imgName }}</label>
                    </div>
                    <button type="submit">Kommentera!</button>
                </div>                
            </form>
        </div>
        <div v-else>
            <h2><a href="login">Logga in</a> för att kommentera!</h2>
        </div>    
    </div>
</template>

<style scoped>
input[type="text"] {
    width: 40%;
    height: calc(var(--icon-size)/2);
}
</style>