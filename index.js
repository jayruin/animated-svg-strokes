// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/strokes.js";

const animationOptions = { totalStrokeDuration: 0.5 };

const characterInput = document.getElementById("character-input");
const zhChecked = document.getElementById("zh-checked");
const jaChecked = document.getElementById("ja-checked");
const strokesOutputFormat = document.getElementById("strokes-output-format");

const zhTarget = document.getElementById("target-zh");
const jaTarget = document.getElementById("target-ja");

const zhExistingCharacters = new Set();
const jaExistingCharacters = new Set();

const renderButton = document.getElementById("render-button");
const clearButton = document.getElementById("clear-button");

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

let draggedElement = null;
function renderCharacter(character, characterType, characterStrokes, target, existingCharacters) {
    if (characterStrokes === null) {
        return;
    }
    characterStrokes.classList.add("character-strokes");
    const characterStrokesContainer = document.createElement("div");
    characterStrokesContainer.draggable = true;
    characterStrokesContainer.id = `character-strokes-${characterType}-${character}`;
    characterStrokesContainer.classList.add("character-strokes-container");
    characterStrokesContainer.append(characterStrokes);
    characterStrokesContainer.addEventListener("dragstart", event => draggedElement = event.target);
    characterStrokesContainer.addEventListener("dragover", event => {
        const draggedIdParts = draggedElement.id.split('-');
        const targetIdParts = event.target.id.split('-');
        const draggedIdValid = draggedIdParts.length === 4 && draggedIdParts[0] === "character" && draggedIdParts[1] === "strokes";
        const targetIdValid = targetIdParts.length === 4 && targetIdParts[0] === "character" && targetIdParts[1] === "strokes";
        const draggedCharacterType = draggedIdParts[2];
        const draggedCharacter = draggedIdParts[3];
        const targetCharacterType = targetIdParts[2];
        const targetCharacter = targetIdParts[3];
        if (!draggedIdValid || !targetIdValid || draggedCharacterType !== targetCharacterType || draggedCharacter === targetCharacter) {
            return;
        }
        event.preventDefault();
        const ratio = event.offsetY / event.target.offsetHeight;
        if (ratio <= 0.5) {
            event.target.before(draggedElement);
        } else {
            event.target.after(draggedElement);
        }
    });
    characterStrokesContainer.addEventListener("dragend", () => draggedElement = null);
    target.prepend(characterStrokesContainer);
    existingCharacters.add(character);
}

renderButton.addEventListener("click", async function () {
    const character = characterInput.value;
    const zhRender = zhChecked.checked && !zhExistingCharacters.has(character);
    const jaRender = jaChecked.checked && !jaExistingCharacters.has(character);
    const promises = [];
    promises.push(zhRender ? strokes("zh", strokesOutputFormat.value, animationOptions)(character) : Promise.resolve(null));
    promises.push(jaRender ? strokes("ja", strokesOutputFormat.value, animationOptions)(character) : Promise.resolve(null));
    const [zhCharacterStrokes, jaCharacterStrokes] = await Promise.all(promises);
    renderCharacter(character, "zh", zhCharacterStrokes, zhTarget, zhExistingCharacters);
    renderCharacter(character, "ja", jaCharacterStrokes, jaTarget, jaExistingCharacters);
});

clearButton.addEventListener("click", async function () {
    if (zhChecked.checked) {
        clear(zhTarget);
        zhExistingCharacters.clear();
    }
    if (jaChecked.checked) {
        clear(jaTarget);
        jaExistingCharacters.clear();
    }
});

clearButton.addEventListener("dragover", event => event.preventDefault());

clearButton.addEventListener("drop", event => {
    event.preventDefault();
    if (draggedElement === null) {
        return;
    }
    const idParts = draggedElement.id.split('-');
    const idValid = idParts.length === 4 && idParts[0] === "character" && idParts[1] === "strokes";
    if (!idValid) {
        return;
    }
    const characterType = idParts[2];
    const character = idParts[3];
    switch (characterType) {
        case "zh":
            zhExistingCharacters.delete(character);
            break;
        case "ja":
            jaExistingCharacters.delete(character);
            break;
    }
    draggedElement.remove();
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