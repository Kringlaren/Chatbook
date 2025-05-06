<script setup>
import { ref, onMounted } from "vue";
import { boot } from "../game/main.js";

const canvas = ref(null);

const keys = {};

const stats = {
  coins: ref(0),
  lives: ref(3),
  points: ref(0),
  pointsMultiplier: ref(1.0),
  highscore: ref(0),
  lastScore: ref(0)
};

function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
}

function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    console.log(canvas.value);
    if (canvas.value) {
      boot(canvas.value, stats, keys);
    }
});
</script>

<template>
    <canvas ref="canvas"></canvas>
    <div>
        <p>
            Infesterade mynt ger dig mer poäng per mynt, men var försiktig, de kan också framkalla en till zombie! <br>
            Varje 16 mynt läggs ett till mynt till och både du och zombiesen blir snabbare!
        </p>

        <div class="stats">
            <p id="coins">Mynt samlade: {{ stats.coins }}</p>
            <p id="pointsmult">x{{ stats.pointsMultiplier }} Poäng</p>
            <hr>
            <p id="points">Poäng: {{ stats.points }}</p>
            <p id="lives">Liv kvar: {{ stats.lives }}</p>
            <hr>
            <p id="highscore">Highscore: {{ stats.highscore }}</p>
            <p id="lastscore">Förra: {{ stats.lastScore }}</p>
        </div>
    </div>
</template>

<style scoped>
.stats {
    position: fixed;
    top:1vw;
    right:3vw;
}
</style>