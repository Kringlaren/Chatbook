import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LogIn from "../views/LogIn.vue";
import Register from "../views/Register.vue";
import UserPage from "../views/UserPage.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: LogIn },
    { path: "/register", component: Register },
    { path: "/:username", component: UserPage }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;