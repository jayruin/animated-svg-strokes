const sources = [];

const sourcesCheckboxes = document.getElementById("sources-checkboxes");
const sourcesOutputs = document.getElementById("sources-outputs");

function getSourceCheckboxId(source) {
    return `${source}-checked`;
}

function getSourceOutputsId(source) {
    return `${source}-outputs`;
}

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
    input.id = getSourceCheckboxId(source);
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
    output.id = getSourceOutputsId(source);
    output.classList.add("animations-container");
    output.classList.add("flex-column");
    output.classList.add("flex-center");
    flexItem.append(output);
}

export function addSource(source) {
    addSourceCheckbox(source);
    addSourceOutputs(source);
    sources.push(source);
}

export function getAllSources() {
    return sources;
}

export function isSourceChecked(source) {
    return document.getElementById(getSourceCheckboxId(source)).checked;
}

export function getOutputsContainer(source) {
    return document.getElementById(getSourceOutputsId(source));
}
