<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";
import selectImg from "../assets/images/selectimg.png";

const props = defineProps({
    post: Object
});

const postStore = usePostStore();
const authStore = useAuthStore();

const content = ref("");
const img = ref(null);
const imageInput = ref(null);
const imgName = ref("");

const createComment = async () => {
    const res = await postStore.createComment(props.post.id, content.value, img.value);
    content.value = "";
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
                <div class="inputrow">
                    <input type="text" v-model="content" name="postContent" placeholder="Sprid dina åsikter!" required/>
                    <div class="imgupload">
                        <img class="icon" :src="selectImg" alt="Välj bild" @click="imageInput.click()" style="cursor: pointer">
                        <input type="file" ref="imageInput" @change="imageChange">
                        <label for="imgUpload" class="imglabel">{{ imgName }}</label>
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