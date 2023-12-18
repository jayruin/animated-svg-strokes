// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/index.js";

const animationOptions = { totalStrokeDuration: 0.5 };

const characterInput = document.getElementById("character-input");
const zhChecked = document.getElementById("zh-checked");
const jaChecked = document.getElementById("ja-checked");
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

document.getElementById("render-button").addEventListener("click", async function () {
    const character = characterInput.value;
    const zhRender = zhChecked.checked && !zhExistingCharacters.has(character);
    const jaRender = jaChecked.checked && !jaExistingCharacters.has(character);
    const promises = [];
    promises.push(zhRender ? strokes("zh", strokesOutputFormat.value, animationOptions)(character) : Promise.resolve(null));
    promises.push(jaRender ? strokes("ja", strokesOutputFormat.value, animationOptions)(character) : Promise.resolve(null));
    const [zhElement, jaElement] = await Promise.all(promises);
    if (zhElement !== null) {
        zhElement.classList.add("stroke");
        zhTarget.prepend(zhElement);
        zhExistingCharacters.add(character);
    }
    if (jaElement !== null) {
        jaElement.classList.add("stroke");
        jaExistingCharacters.add(character);
        jaTarget.prepend(jaElement);
    }
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