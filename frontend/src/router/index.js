import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LogIn from "../views/LogIn.vue";
import Register from "../views/Register.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: LogIn },
    { path: "/register", component: Register },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;