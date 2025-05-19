<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores";

const userStore = useUserStore();

let changeMade = false;

let primaryColor;
let textColor;
let detailColor;
let linkColor;

// p - primary
const pr = ref(255);
const pg = ref(255);
const pb = ref(255);

// t - text
const tr = ref(255);
const tg = ref(255);
const tb = ref(255);

// d - detail
const dr = ref(255);
const dg = ref(255);
const db = ref(255);

// l - link
const lr = ref(255);
const lg = ref(255);
const lb = ref(255);

onMounted(() => {
  setSlidersFromComputedColor();
});

const saveStyles = () => {
    if (!changeMade) return;
    let colors = [];

    if (primaryColor && userStore.userPreferences.bg_color !== primaryColor) {colors.push({ type: "bg_color", color: primaryColor })}
    if (textColor && userStore.userPreferences.text_color !== textColor) {colors.push({ type: "text_color", color: textColor })}
    if (detailColor && userStore.userPreferences.detail_color !== detailColor) {colors.push({ type: "detail_color", color: detailColor })}
    if (linkColor && userStore.userPreferences.link_color !== linkColor) {colors.push({ type: "link_color", color: linkColor })}

    userStore.changeColors(colors);
    changeMade = false;
};

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
        case "link":
            linkColor = `rgb(${lr.value}, ${lg.value}, ${lb.value})`;
            document.documentElement.style.setProperty('--link-color', linkColor);
            break;
    }
    
    changeMade = true;
};

const resetColors = (type) => {
    switch (type) {
        case "primary":
            document.documentElement.style.removeProperty('--primary-color');
            break;
        case "text":
            document.documentElement.style.removeProperty('--text-color');
            break;
        case "detail":
            document.documentElement.style.removeProperty('--detail-color');
            break;
        case "link":
            document.documentElement.style.removeProperty('--link-color');
            break;
    }

    setSlidersFromComputedColor();
    changeMade = true;

    const style = getComputedStyle(document.documentElement);
    switch (type) {
      case "primary":
        primaryColor = style.getPropertyValue('--primary-color');
        break;
      case "text":
        textColor = style.getPropertyValue('--text-color');
        break;
      case "detail":
        detailColor = style.getPropertyValue('--detail-color');
        break;
      case "link":
        linkColor = style.getPropertyValue('--link-color');
        break;
    }
};

const setSlidersFromComputedColor = () => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary-color');
    const text = style.getPropertyValue('--text-color');
    const detail = style.getPropertyValue('--detail-color');
    const link = style.getPropertyValue('--link-color');

    const [epr, epg, epb] = extractRGB(primary);
    const [etr, etg, etb] = extractRGB(text);
    const [edr, edg, edb] = extractRGB(detail);
    const [elr, elg, elb] = extractRGB(link);

    pr.value = epr;
    pg.value = epg;
    pb.value = epb;

    tr.value = etr;
    tg.value = etg;
    tb.value = etb;

    dr.value = edr;
    dg.value = edg;
    db.value = edb;

    lr.value = elr;
    lg.value = elg;
    lb.value = elb;
};

// Gör en array av en rgb-sträng på formen rgb(RRR, GGG, BBB) eller liknande
const extractRGB = (rgbStr) => {
  const match = rgbStr.match(/\d+/g);
  return match ? match.map(Number) : [255, 255, 255];
};
</script>

<template>
    <div class="settings card">
        <div>
            <h4>Huvudfärg</h4>
            <div class="color-setting">
                <label for="pr">R</label>
                <input class="slider" v-model="pr" @input="changeColors('primary')" id="pr" type="range" max="255" name="r">
                <label  for="pg">G</label>
                <input class="slider" v-model="pg" @input="changeColors('primary')" id="pg" type="range" max="255" name="g">
                <label for="pb">B</label>
                <input class="slider" v-model="pb" @input="changeColors('primary')" id="pb" type="range" max="255" name="b">
                <button @click="resetColors('primary')" class="reset">Återställ</button>
            </div>
        </div>
        
        <div>
            <h4>Textfärg</h4>
            <div class="color-setting">
                <label for="tr">R</label>
                <input class="slider" v-model="tr" @input="changeColors('text')" id="tr" type="range" max="255" name="r">
                <label for="tg">G</label>
                <input class="slider" v-model="tg" @input="changeColors('text')" id="tg" type="range" max="255" name="g">
                <label for="tb">B</label>
                <input class="slider" v-model="tb" @input="changeColors('text')" id="tb" type="range" max="255" name="b">
                <button @click="resetColors('text')" class="reset">Återställ</button>
            </div>
        </div>
        
        <div>
            <h4>Detaljfärg</h4>
            <div class="color-setting">
                <label for="dr">R</label>
                <input class="slider" v-model="dr" @input="changeColors('detail')" id="dr" type="range" max="255" name="r">
                <label for="dg">G</label>
                <input class="slider" v-model="dg" @input="changeColors('detail')" id="dg" type="range" max="255" name="g">
                <label for="db">B</label>
                <input class="slider" v-model="db" @input="changeColors('detail')" id="db" type="range" max="255" name="b">
                <button @click="resetColors('detail')" class="reset">Återställ</button>
            </div>
        </div>

        <div>
            <h4>Länkfärg</h4>
            <div class="color-setting">
                <label for="lr">R</label>
                <input class="slider" v-model="lr" @input="changeColors('link')" id="lr" type="range" max="255" name="r">
                <label for="lg">G</label>
                <input class="slider" v-model="lg" @input="changeColors('link')" id="lg" type="range" max="255" name="g">
                <label for="lb">B</label>
                <input class="slider" v-model="lb" @input="changeColors('link')" id="lb" type="range" max="255" name="b">
                <button @click="resetColors('link')" class="reset">Återställ</button>
            </div>
            
        </div>
        <div class="bottom-middle">
            <button @click="saveStyles()">Spara</button>
        </div>
    </div>
</template>

<style scoped>
button {
    font-size: var(--xs-font-size);
}

h4 {
    margin: 0;
}

label {
    font-size: var(--small-font-size);
}

.settings {
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
    gap: var(--profile-gap);
}

.reset {
    margin-top: calc(var(--default-gap)/3);
}

.slider {
    -webkit-appearance: none; 
    appearance: none;
    background-color: var(--detail-color);
    width: 10vw;
    height: 0.3vw;
    cursor: grab;
    border-radius: var(--default-border-radius);
}
.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1vw;
    height: 1vw;
    border-radius: 100%;
    background-color: var(--text-color);
}
.slider:active {
    cursor: grabbing;
}

.color-setting {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-gap)/4);
}

.bottom-middle {
    grid-column-start: 1;
    grid-column-end: 3;
}

@media only screen and (max-width: 1100px) {
    .slider {
        width: 20vw;
        height: 1vw;
    }
    .slider::-webkit-slider-thumb {
        width: 2vw;
        height: 2vw;
    }
}
</style>