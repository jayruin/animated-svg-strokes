// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes, getSources, getFormats } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/strokes.js";

let counter = 0;
function getCounter() {
    counter += 1;
    return counter;
}

const sources = Array.from(getSources()).reverse();
const formats = Array.from(getFormats()).reverse();

const animationOptions = { totalStrokeDuration: 0.5 };

const characterInput = document.getElementById("character-input");

const renderButton = document.getElementById("render-button");
const clearButton = document.getElementById("clear-button");

function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

const sourcesCheckboxes = document.getElementById("sources-checkboxes");
const sourcesOutputs = document.getElementById("sources-outputs");
function addSourceCheckbox(source) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");
    sourcesCheckboxes.append(flexItem);
    const label = document.createElement("label");
    label.classList.add("options");
    flexItem.append(label);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    input.id = `${source}-checked`;
    label.append(input);
    const text = document.createElement("div");
    text.append(source);
    label.append(text);
}
function addSourceOutputs(source) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");
    sourcesOutputs.append(flexItem);
    const output = document.createElement("div");
    output.id = `${source}-outputs`;
    output.classList.add("strokes-container");
    output.classList.add("flex-column");
    output.classList.add("flex-center");
    flexItem.append(output);
}
function addSource(source) {
    addSourceCheckbox(source);
    addSourceOutputs(source)
}

for (const source of sources) {
    addSource(source);
}

const strokesFormat = document.getElementById("strokes-format");
function addFormat(format) {
    const option = document.createElement("option");
    option.value = format;
    option.append(format);
    strokesFormat.append(option);
}
for (const format of formats) {
    addFormat(format);
}

let draggedElement = null;
function renderCharacter(character, source, characterStrokes) {
    if (characterStrokes === null) {
        return;
    }
    characterStrokes.classList.add("character-strokes");
    const characterStrokesContainer = document.createElement("div");
    characterStrokesContainer.draggable = true;
    characterStrokesContainer.id = `character-strokes-${source}-${character}-${getCounter()}`;
    characterStrokesContainer.classList.add("character-strokes-container");
    characterStrokesContainer.append(characterStrokes);
    characterStrokesContainer.addEventListener("click", event => {
        event.preventDefault();
        characterStrokes.dispatchEvent(new Event("click"));
    });
    characterStrokesContainer.addEventListener("dragstart", event => draggedElement = event.target);
    characterStrokesContainer.addEventListener("dragover", event => {
        const draggedIdParts = draggedElement.id.split('-');
        const targetIdParts = event.target.id.split('-');
        const draggedIdValid = draggedIdParts.length === 5 && draggedIdParts[0] === "character" && draggedIdParts[1] === "strokes";
        const targetIdValid = targetIdParts.length === 5 && targetIdParts[0] === "character" && targetIdParts[1] === "strokes";
        const draggedCharacterSource = draggedIdParts[2];
        const draggedCharacter = draggedIdParts[3];
        const targetCharacterSource = targetIdParts[2];
        const targetCharacter = targetIdParts[3];
        if (!draggedIdValid || !targetIdValid || draggedCharacterSource !== targetCharacterSource || draggedCharacter === targetCharacter) {
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
    document.getElementById(`${source}-outputs`).prepend(characterStrokesContainer);
}

renderButton.addEventListener("click", async () => {
    const character = characterInput.value;
    const promises = [];
    for (const source of sources) {
        const shouldRender = document.getElementById(`${source}-checked`).checked;
        promises.push(shouldRender ? strokes({ source, format: strokesFormat.value, options: animationOptions })(character) : Promise.resolve(null));
    }
    const outputs = await Promise.all(promises.values());
    let i = 0;
    for (const source of sources) {
        const characterStrokes = outputs[i];
        renderCharacter(character, source, characterStrokes);
        i += 1;
    }
});

clearButton.addEventListener("click", () => {
    for (const source of sources) {
        if (document.getElementById(`${source}-checked`).checked) {
            clear(document.getElementById(`${source}-outputs`));
        }
    }
});

clearButton.addEventListener("dragover", event => event.preventDefault());

clearButton.addEventListener("drop", event => {
    event.preventDefault();
    if (draggedElement === null) {
        return;
    }
    const idParts = draggedElement.id.split('-');
    const idValid = idParts.length === 5 && idParts[0] === "character" && idParts[1] === "strokes";
    if (!idValid) {
        return;
    }
    draggedElement.remove();
});

let isDark = false;
function renderTheme() {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty("--color", "white");
        root.style.setProperty("--background-color", "black");
        sourcesOutputs.style.filter = "invert(100%)";
    } else {
        root.style.setProperty("--color", "black");
        root.style.setProperty("--background-color", "white");
        sourcesOutputs.style.filter = "";
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
document.getElementById("toggle-theme-button").addEventListener("click", () => {
    isDark = !isDark;
    renderTheme();
});
prefersDarkSchemeQuery().addEventListener("change", renderPreferredTheme);
renderPreferredTheme();