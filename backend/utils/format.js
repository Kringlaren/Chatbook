const formatValuesForFrontEnd = (rows) => {
    const formatedRows = Array.isArray(rows) ? rows : [rows];
    formatedRows.forEach(row => {
        if (row.username) {row.username = formatNameForFrontEnd(row.username)}
        if (row.created_at) {row.created_at = formatTime(row.created_at)}
    });

    return formatedRows;
}

const formatNameForFrontEnd = (name) => {
    return name.replace(/\./g, " ");
}
const formatNameForBackEnd = (name) => {
    return name.replace(/\s+/g, ".");
}

const formatTime = (time) => {
    return new Date(String(time)).toLocaleString("sv-SE", {
        dateStyle: "short",   // Kort datumformat
        timeStyle: "short"    // Kort tidsformat
    });
}

const formatColorsForBackEnd = (rows) => {
    const formatedRows = Array.isArray(rows) ? rows : [rows];
    formatedRows.forEach(row => {
        if (row.bg_color) {row.bg_color = rgbToHex(row.bg_color)}
        if (row.text_color) {row.text_color = rgbToHex(row.text_color)}
        if (row.detail_color) {row.detail_color = rgbToHex(row.detail_color)}
    });

    return formatedRows;
}

const formatColorsForFrontEnd = (rows) => {
    const formatedRows = Array.isArray(rows) ? rows : [rows];
    formatedRows.forEach(row => {
        if (row.bg_color) {row.bg_color = hexToRgb(row.bg_color)}
        if (row.text_color) {row.text_color = hexToRgb(row.text_color)}
        if (row.detail_color) {row.detail_color = hexToRgb(row.detail_color)}
    });

    return formatedRows;
}

const toHex = (value) => {
    return value.toString(16).padStart(2, '0');
}
  
const rgbToHex = (str) => {
    const match = str.match(/\d+/g);
    const rgb = match.map(Number);
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

export default {
    formatValuesForFrontEnd,
    formatNameForBackEnd,
    formatNameForFrontEnd,
    formatTime,
    formatColorsForBackEnd,
    formatColorsForFrontEnd,
    hexToRgb,
    rgbToHex
};