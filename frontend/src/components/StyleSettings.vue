<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores";

const userStore = useUserStore();
let changeMade = false;
let primaryColor;
let textColor;
let detailColor;

const pr = ref(255);
const pg = ref(255);
const pb = ref(255);

const tr = ref(255);
const tg = ref(255);
const tb = ref(255);

const dr = ref(255);
const dg = ref(255);
const db = ref(255);

onMounted(() => {
  setSlidersFromComputedColor();
});

const saveStyles = () => {
    if (!changeMade) return;
    userStore.changeColors("bg_color", primaryColor);
    changeMade = false;
}

const changeColors = (type) => {
    switch (type) {
        case "primary":
            primaryColor = `rgb(${pr.value}, ${pg.value}, ${pb.value})`;
            document.documentElement.style.setProperty('--primary-color', primaryColor);
            break;
        case "text":
            textColor = `rgb(${tr.value}, ${tg.value}, ${tb.value})`;
            document.documentElement.style.setProperty('--text-color', textColor);
            break;
        case "detail":
            detailColor = `rgb(${dr.value}, ${dg.value}, ${db.value})`;
            document.documentElement.style.setProperty('--detail-color', detailColor);
            break;
    }
    
    
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
  const text = style.getPropertyValue('--text-color');
  const detail = style.getPropertyValue('--detail-color');

  const [epr, epg, epb] = extractRGB(primary);
  const [etr, etg, etb] = extractRGB(text);
  const [edr, edg, edb] = extractRGB(detail);

  pr.value = epr;
  pg.value = epg;
  pb.value = epb;

  tr.value = etr;
  tg.value = etg;
  tb.value = etb;

  dr.value = edr;
  dg.value = edg;
  db.value = edb;
};

const extractRGB = (rgbStr) => {
  const match = rgbStr.match(/\d+/g);
  return match ? match.map(Number) : [255, 255, 255];
}
</script>

<template>
    <div class="settings border">
        <div style="grid-column: 1; grid-row: 1;">
            <h4 class="header">Huvudfärg</h4>
            <label for="pr">R</label>
            <input class="slider" v-model="pr" @input="changeColors('primary')" id="pr" type="range" max="255" name="r"> <br>
            <label  for="pg">G</label>
            <input class="slider" v-model="pg" @input="changeColors('primary')" id="pg" type="range" max="255" name="g"> <br>
            <label for="pb">B</label>
            <input class="slider" v-model="pb" @input="changeColors('primary')" id="pb" type="range" max="255" name="b"> <br>
            <button @click="resetPrimaryColor()" class="reset">Återställ</button>
        </div>
        
        <div style="grid-column: 2; grid-row: 1;">
            <h4>Textfärg</h4>
            <label for="tr">R</label>
            <input class="slider" v-model="tr" @input="changeColors('text')" id="tr" type="range" max="255" name="r"> <br>
            <label for="tg">G</label>
            <input class="slider" v-model="tg" @input="changeColors('text')" id="tg" type="range" max="255" name="g"> <br>
            <label for="tb">B</label>
            <input class="slider" v-model="tb" @input="changeColors('text')" id="tb" type="range" max="255" name="b"> <br>
        </div>
        
        <div style="grid-column: 1; grid-row: 2;">
            <h4>Detaljfärg</h4>
            <label for="dr">R</label>
            <input class="slider" v-model="dr" @input="changeColors('detail')" id="dr" type="range" max="255" name="r"> <br>
            <label for="dg">G</label>
            <input class="slider" v-model="dg" @input="changeColors('detail')" id="dg" type="range" max="255" name="g"> <br>
            <label for="db">B</label>
            <input class="slider" v-model="db" @input="changeColors('detail')" id="db" type="range" max="255" name="b"> <br>
        </div>

        <button @click="saveStyles()">Spara</button>
    </div>
</template>

<style scoped>
.settings {
    background-color: var(--primary-color);
    display: grid;
    gap: var(--default-gap);
    padding: var(--default-gap);
}
button {
    font-size: var(--small-font-size);
}

h4 {
    margin: 0;
}
</style>