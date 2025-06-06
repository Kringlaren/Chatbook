<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { boot, resizeGame, endGame } from "../game/main.js";
import { useAuthStore, useGameStore } from "../stores";
import infoImg from "../assets/images/info.png";
import Navbar from "../components/Navbar.vue";
import Scoreboard from "../components/Scoreboard.vue";

const authStore = useAuthStore();
const gameStore = useGameStore();

const canvas = ref(null);

const infoVisible = ref(false);

const keys = {};

const stats = {
  coins: ref(0),
  lives: ref(0),
  points: ref(0),
  pointsMultiplier: ref(1.0),
  pb: ref(0),
  lastScore: ref(0)
};

function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
};
function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
};

const handleResize = () => resizeGame(canvas.value);

onMounted(async () => {
    if (authStore.isLoggedIn) {
        const pbRes = await gameStore.fetchPb();

        if (!pbRes.error && pbRes.score) {
            stats.pb.value = pbRes.score.score;
        }
    }

    if (canvas.value) {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('resize', handleResize);
        boot(canvas.value, stats, keys);
    }
});

// Tar bort eventlisteners och stänger av spelet när sidan ändras för att det inte ska vara i bakgrunden på andra delar av webbplatsen
onUnmounted(() => {
    endGame();
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('resize', handleResize);
});

// När personbästat uppdateras i spelet sparas poängen i databasen
watch(
    () => stats.pb.value,
    async (score) => {
        if (authStore.isLoggedIn) {
            await gameStore.saveScore(score);
        }
    }
);
</script>

<template>
    <Navbar></Navbar>
    <div class="layout">
        <div class="container">
            <canvas ref="canvas"></canvas>
            <button class="icon-button info-button" @click="infoVisible = !infoVisible"><img class="icon" :src="infoImg" alt="info"></button>
            <p v-if="infoVisible" class="info over">
                Infesterade mynt ger dig mer poäng per mynt, men var försiktig, de kan också framkalla en till zombie! <br>
                Varje 16 mynt läggs ett till mynt till och både du och zombiesen blir snabbare!
            </p>
        </div>
        
        <div class="stats">
            <div>
                <h3>Dina stats</h3>
                <p>Mynt samlade: {{ stats.coins }}</p>
                <p>x{{ stats.pointsMultiplier }} Poäng</p>
                <hr>
                <p>Poäng: {{ stats.points }}</p>
                <p>Liv kvar: {{ stats.lives }}</p>
                <hr>
                <p>Personbästa: {{ stats.pb }}</p>
                <p>Förra: {{ stats.lastScore }}</p>
            </div>

            <div class="scrollable scoreboard">
                <Scoreboard></Scoreboard>
            </div>
        </div>
    </div>
    <p class="not-supported-info">Sidan stödjer inte din skärmstorlek</p>
</template>

<style scoped>
canvas {
    float: left;
}

h3 {
    margin:0;
}

.stats {
    margin:  var(--default-gap) calc(var(--default-gap)*2) 0 calc(var(--default-gap)*2);
}

.layout {
    display: flex;
}

.scoreboard {
    max-height: 16vw;
}

.info-button {
    position: absolute;
    top: var(--default-padding);
    right: var(--default-padding);
}
.info {
    top: 5%;
    right: 1%;
}

.not-supported-info {
    display: none;
}

/*Inte jättabra stöd för smalare skärmar och inget alls för mobiler och liknande*/
@media only screen and (max-width: 1100px) {
    canvas {
        float: none;
    }
    .layout {
        flex-direction: column;
    }
    .scoreboard {
        max-height: 25vw;
    }
}

@media only screen and (max-width: 600px) {
    .layout {
        display: none;
    }
    .not-supported-info {
        display: block;
    }
}
</style>