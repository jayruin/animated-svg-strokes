// import { strokes } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/index.js";
import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";

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

document.getElementById("generate-button").addEventListener("click", async function () {
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