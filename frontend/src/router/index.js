import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import LogIn from "../views/LogIn.vue";
import Register from "../views/Register.vue";
import UserPage from "../views/UserPage.vue";
import Game from "../views/Game.vue";
import Following from "../views/Following.vue";
import NotFound from "../views/404.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: LogIn },
    { path: "/register", component: Register },
    { path: "/user/:username", component: UserPage },
    { path: "/game", component:  Game },
    { path: "/following", component: Following },
    { path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;