<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { checkUserName, checkUserPassword } from "../services/validationService.js";
import { useAuthStore } from '../stores';

const authStore = useAuthStore();

const router = useRouter();

const errorMessage = ref("");
const usernameError = ref("");
const passwordError = ref("");
const username = ref("");
const password = ref("");

// Registrerar om alla fält är giltiga
const register = async () => {
    if (!checkUserName(username.value) || !checkUserPassword(password.value)) {
        errorMessage.value = "Kontrollera dina uppgifter";
        return;
    }
    const res = await authStore.registerUser(username.value, password.value);
    if (!res.error) {
        router.push("/");
    } else {
        errorMessage.value = res.error;
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
};
</script>

<template>
    <div class="flex-column center">
        <h1>Registrera dig!</h1>
        <div class="card form">
            <div>
                <img class="big-profile-pic" src="/favicon.png" alt="profilbild">
            </div>
            <form @submit.prevent="register">
                <div class="left">
                    <label for="username"><b>Användarnamn</b></label>
                    <input v-model="username" @blur="checkName" type="text" id="username" maxlength="20" placeholder="ex John Doe" required />
                    <div v-if="usernameError" class="error">{{ usernameError }}</div>

                    <label for="password"><b>Lösenord</b></label>
                    <input v-model="password" @blur="checkPassword" type="password" id="password" maxlength="255" required />
                    <div v-if="passwordError" class="error">{{ passwordError }}</div>
                </div>
                <button type="submit">Skapa konto</button>
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            </form>
        </div>
        <p>Hur du redan ett konto?</p>
        <a href="login">Logga in här</a>
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
    width: 100%;
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