<script setup>
import { ref, onMounted, watch } from "vue";
import { useGameStore } from "../stores";

const gameStore = useGameStore();

const scores = ref([]);
const errorMessage = ref("");

onMounted(async () => {
    reloadBoard();
});

async function reloadBoard() {
    const res = await gameStore.fetchScoreboard();
    if (res.error) {
        errorMessage.value = res.error;
    }
}

watch (
    () => gameStore.scoreboard,
        (board) => {
            console.log("scoreboard skillnad");
            scores.value = board;
        }
)
</script>

<template>
    <div>
        <h3>Topplista</h3>
        <ol v-if="scores.lenght !== 0">
            <li v-for="score in scores" :key="score.id">{{ score.username }} - {{ score.score }}</li>
        </ol>
        <p v-else-if="errorMessage">{{ errorMessage }}</p>
    </div>
</template>