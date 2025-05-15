<script setup>
import { ref, onMounted, watch } from "vue";
import { useGameStore } from "../stores";

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
        scores.value = board;
    }
);

const reloadBoard = async () => {
    let top = props.top ? props.top : 0;
    const res = await gameStore.fetchScoreboard(top);
    if (res.error) {
        errorMessage.value = res.error;
    }
}
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