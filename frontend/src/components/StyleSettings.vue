<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores";

const userStore = useUserStore();
let changeMade = false;
let primaryColor;

const pr = ref(255);
const pg = ref(255);
const pb = ref(255);

onMounted(() => {
  setSlidersFromComputedColor();
});

const saveStyles = () => {
    if (!changeMade) return;
    userStore.changeColors("bg_color", primaryColor);
    changeMade = false;
}

const changePrimaryColor = () => {
    primaryColor = `rgb(${pr.value}, ${pg.value}, ${pb.value})`;
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    changeMade = true
}
const resetPrimaryColor = () => {
    document.documentElement.style.removeProperty('--primary-color');
    setSlidersFromComputedColor();
    changeMade = false;
}

const setSlidersFromComputedColor = () => {
  const style = getComputedStyle(document.documentElement);
  const primary = style.getPropertyValue('--primary-color');
  const [r, g, b] = extractRGB(primary);
  pr.value = r;
  pg.value = g;
  pb.value = b;
}

const extractRGB = (rgbStr) => {
  const match = rgbStr.match(/\d+/g);
  return match ? match.map(Number) : [255, 255, 255];
}
</script>

<template>
    <div class="settings border">
        <div>
            <h4>Huvudfärg</h4>
            <label for="pr">R</label>
            <input class="slider" v-model="pr" @input="changePrimaryColor()" id="pr" type="range" max="255" name="r"> <br>
            <label  for="pg">G</label>
            <input class="slider" v-model="pg" @input="changePrimaryColor()" id="pg" type="range" max="255" name="g"> <br>
            <label for="pb">B</label>
            <input class="slider" v-model="pb" @input="changePrimaryColor()" id="pb" type="range" max="255" name="b"> <br>
            <button @click="resetPrimaryColor()">Återsäll</button>
        </div>
        
        <div>
            <h4>Sekundärfärg</h4>
            <label for="sr">R</label>
            <input class="slider" @input="changeSecondaryColor()" id="sr" type="range" max="255" value="255" name="r"> <br>
            <label for="sg">G</label>
            <input class="slider" @input="changeSecondaryColor()" id="sg" type="range" max="255" value="105" name="g"> <br>
            <label for="sb">B</label>
            <input class="slider" @input="changeSecondaryColor()" id="sb" type="range" max="255" value="180" name="b"> <br>
        </div>
        
        <div>
            <h4>Textfärg</h4>
            <label for="tr">R</label>
            <input class="slider" @input="changeTextColor()" id="tr" type="range" max="255" value="0" name="r"> <br>
            <label for="tg">G</label>
            <input class="slider" @input="changeTextColor()" id="tg" type="range" max="255" value="0" name="g"> <br>
            <label for="tb">B</label>
            <input class="slider" @input="changeTextColor()" id="tb" type="range" max="255" value="0" name="b"> <br>
        </div>

        <button @click="saveStyles()">Spara</button>
    </div>
</template>

<style scoped>
.settings {
    background-color: var(--primary-color);
}
</style>