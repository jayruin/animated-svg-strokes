// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/index.js";

const characterInput = document.getElementById("character-input");
const strokesType = document.getElementById("strokes-type");
const strokesOutputFormat = document.getElementById("strokes-output-format");

const zhTarget = document.getElementById("target-zh");
const jaTarget = document.getElementById("target-ja");

const zhExistingCharacters = new Set();
const jaExistingCharacters = new Set();

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

function getExistingCharacters() {
    switch (strokesType.value) {
        case "zh":
            return zhExistingCharacters;
        case "ja":
            return jaExistingCharacters;
    }
}

function getTarget() {
    switch (strokesType.value) {
        case "zh":
            return zhTarget;
        case "ja":
            return jaTarget;
    }
}

document.getElementById("render-button").addEventListener("click", async function () {
    const character = characterInput.value;
    const existingCharacters = getExistingCharacters();
    if (existingCharacters.has(character)) {
        return;
    } else {
        existingCharacters.add(character);
    }
    const strokesElement = await strokes(strokesType.value, strokesOutputFormat.value, { totalStrokeDuration: 0.5 })(character);
    strokesElement.classList.add("stroke");
    const target = getTarget();
    target.appendChild(strokesElement);
});

document.getElementById("clear-button").addEventListener("click", async function () {
    clear(zhTarget);
    clear(jaTarget);
    zhExistingCharacters.clear();
    jaExistingCharacters.clear();
    characterInput.value = characterInput.defaultValue;
});

let isDark = false;
function renderTheme() {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty("--color", "white");
        root.style.setProperty("--background-color", "black");
        zhTarget.style.filter = "invert(100%)";
        jaTarget.style.filter = "invert(100%)";
    } else {
        root.style.setProperty("--color", "black");
        root.style.setProperty("--background-color", "white");
        zhTarget.style.filter = "";
        jaTarget.style.filter = "";
    }
}
function prefersDarkSchemeQuery() {
    return window.matchMedia("(prefers-color-scheme: dark)");
}
function renderPreferredTheme() {
    if (prefersDarkSchemeQuery().matches) {
        isDark = true;
    } else {
        isDark = false;
    }
    renderTheme();
}
document.getElementById("toggle-theme-button").addEventListener("click", async function () {
    isDark = !isDark;
    renderTheme();
});
prefersDarkSchemeQuery().addEventListener("change", renderPreferredTheme);
renderPreferredTheme();