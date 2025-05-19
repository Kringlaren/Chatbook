<script setup>
import { ref, onMounted, watch } from "vue";
import { useGameStore } from "../stores";
import { formatNameForBackEnd } from "../services/format";

const gameStore = useGameStore();

// Hur lång topplistan ska vara, t.ex top 10
const props = defineProps({
    top: Number,
});

const scores = ref([]);
const errorMessage = ref("");

onMounted(async () => {
    reloadBoard();
});

watch (
    () => gameStore.scoreboard,
    (board) => {
        if (props.top) {
            scores.value = board.slice(0, props.top);
        } else {
            scores.value = board;
        }
    }
);

const reloadBoard = async () => {
    const res = await gameStore.fetchScoreboard();
    if (res.error) {
        errorMessage.value = res.error;
    }
};
</script>

<template>
    <div>
        <h3>Topplista</h3>
        <ol v-if="scores.lenght !== 0">
            <li v-for="score in scores" :key="score.id"><router-link :to="'/user/' + formatNameForBackEnd(score.username)">{{ score.username }}</router-link> - {{ score.score }}</li>
        </ol>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>
    </div>
</template>

<style scoped>
a {
    font-size: var(--small-font-size);
}
</style>