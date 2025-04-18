const formatValuesForFrontEnd = (rows) => {
    const formatedRows = Array.isArray(rows) ? rows : [rows];
    formatedRows.forEach(row => {
        row.username = formatNameForFrontEnd(row.username);
        row.created_at = formatTime(row.created_at);
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

export default {
    formatValuesForFrontEnd,
    formatNameForBackEnd,
    formatNameForFrontEnd,
    formatTime
};