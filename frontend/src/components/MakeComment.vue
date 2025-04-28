<script setup>
import { ref } from "vue";
import { usePostStore, useAuthStore } from "../stores/";

const props = defineProps({
    post: Object
});

const postStore = usePostStore();
const authStore = useAuthStore();

const content = ref("");
const img = ref(null);

const createComment = async () => {
    const res = await postStore.createComment(props.post.id, content.value, img.value);
    if (res.error) {
        alert(res.error);
    }
}

const imageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        img.value = file;
    }
}
</script>

<template>
    <div>
        <div v-if="authStore.isLoggedIn">
            <form @submit.prevent="createComment()">
                <input type="text" v-model="content" name="postContent" placeholder="Sprid dina åsikter!" required/>
                <input @change="imageChange" type="file" accept="image/*">
                <button type="submit">Kommentera!</button>
            </form>
        </div>
        <div v-else>
            <h2><a href="login">Logga in</a> för att kommentera!</h2>
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