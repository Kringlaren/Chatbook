import { createRouter, createWebHistory } from "vue-router";
import Feed from "../views/Feed.vue";

const routes = [
    { path: "/", component: Feed }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;