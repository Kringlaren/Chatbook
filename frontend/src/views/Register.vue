<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { checkUserName, checkUserPassword } from "../services/validationService.js";
import { useAuthStore } from '../stores/authStore.js';
const auth = useAuthStore();

const router = useRouter();

const errorMessage = ref("");
const usernameError = ref("");
const passwordError = ref("");
const username = ref("");
const password = ref("");

const CREATED = 201;

// Registrerar via service om alla fält är giltiga
const register = async () => {
    if (!checkUserName(username.value) || !checkUserPassword(password.value)) {
        errorMessage.value = "Kontrollera dina uppgifter";
        return;
    }
    const res = await auth.registerUser(username.value, password.value);
    if (res.status === CREATED) {
        router.push("/");
    } else {
        errorMessage.value = res.error
    }
    
};

const checkName = () => {
    if (!username.value) {
        usernameError.value = "";
        return;
    }

    if (!checkUserName(username.value)){
        usernameError.value = "Användarnamn måste börja med en bokstav och får endast ha understreck, bindestreck eller mellanslag som specialtecken";
    } else {
        usernameError.value = "";
    }
};
const checkPassword = () => {
    if (!password.value) {
        passwordError.value = "";
        return;
    }

    if (!checkUserPassword(password.value)) {
        passwordError.value = "Lösenord måste innehålla 8 tecken, 1 bokstav, 1 siffra och 1 specialtecken";
    } else {
        passwordError.value = "";
    }
}
</script>

<template>
    <div>
        <h1>Registrera dig!</h1>
        <form @submit.prevent="register">
            <div>
                <div>
                    <label for="username">Användarnamn</label>
                    <input v-model="username" @blur="checkName" type="text" id="username" maxlength="50" placeholder="ex John Doe" required />
                </div>
                <div v-if="usernameError">{{ usernameError }}</div>
            </div>
            <div>
                <div>
                    <label for="password">Lösenord</label>
                    <input v-model="password" @blur="checkPassword" type="password" id="password" maxlength="255" required />
                </div>
                <div v-if="passwordError">{{ passwordError }}</div>
            </div>
            <button type="submit">Skapa konto</button>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
    </div>
    <div>
        <p>Hur du redan ett konto?</p>
        <a href="login">Logga in här</a>
    </div>
</template>