import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import LogIn from "../views/LogIn.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: LogIn},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;