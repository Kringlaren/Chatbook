<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores";
import profileImg from "../assets/images/pp.png";

const authStore = useAuthStore();

const router = useRouter();

const errorMessage = ref("");
const username = ref("");
const password = ref("");


const logIn = async () => {
    const res = await authStore.logInUser(username.value, password.value);
    if (authStore.isLoggedIn) {
        router.push("/");
    } else if (res.error) {
        errorMessage.value = res.error;
    }
};

onMounted(async () => {
    if (authStore.isLoggedIn) {
        router.push("/");
    }
});
</script>

<template>
    <div class="flex-column center">
        <h1>Logga in</h1>
        <div class="card form">
            <div>
                <img class="big-profile-pic" :src="profileImg" alt="profilbild">
            </div>
            <form @submit.prevent="logIn">
                <div class="left">
                    <label for="username"><b>Användarnamn</b></label>
                    <input v-model="username" type="text" id="username" maxlength="20" required />

                    <label for="password"><b>Lösenord</b></label>
                    <input v-model="password" type="password" id="password" maxlength="255" required />
                </div>
                <div>
                    <button type="submit">Logga in</button>
                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                </div>
            </form>
        </div>
        <p>Hur du inte ett konto?</p>
        <a href="register">Registrera dig här</a>
    </div>  
</template>

<style scoped>
input, .form {
    box-sizing: border-box;
}
input {
    width: 100%;
}
button {
    margin-top: var(--default-gap);
}
p {
    margin-bottom: 0;
}
.form {
    width: 40vw;
    margin-bottom: var(--default-gap);
}
.left {
    text-align: left;
}
.center {
    align-items: center;
}

@media only screen and (max-width: 1100px) {
    .form {
        width: 75vw;
    }
}
</style>