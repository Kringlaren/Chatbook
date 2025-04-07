<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logInUser } from "../services/authService.js";

const router = useRouter();
const errorMessage = ref("");
const username = ref("");
const password = ref("");

const OK = 200;
const UNAUTHORIZED = 401;

const logIn = async () => {
    const res = await logInUser(username.value, password.value);

    if (res.status === OK) {
        router.push("/");
    } else {
        if (res.status === UNAUTHORIZED) {
            errorMessage.value = res.error;
        } else {
            errorMessage.value = "Nätverksfel!";
        }
        
    }
};
</script>

<template>
    <div>
        <h1>Logga in</h1>
        <form @submit.prevent="logIn">
            <div>
                <label for="username">Användarnamn</label>
                <input v-model="username" type="text" id="username" required />
            </div>
            <div>
                <label for="password">Lösenord</label>
                <input v-model="password" type="password" id="password" required />
            </div>
            <button type="submit">Logga in</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
</template>