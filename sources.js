import { searchParams } from "./url-snapshot.js";

const sources = [];

const sourcesCheckboxes = document.getElementById("sources-checkboxes");
const sourcesOutputs = document.getElementById("sources-outputs");
const sourcesErrors = document.getElementById("sources-errors");

function getSourceCheckboxId(source) {
    return `${source}-checked`;
}

function getSourceOutputsId(source) {
    return `${source}-outputs`;
}

function getSourceErrorsId(source) {
    return `${source}-errors`;
}

function getSourceSearchParamKey(source) {
    return `source_${source}`;
}

function addSourceCheckbox(source) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");
    sourcesCheckboxes.append(flexItem);
    const label = document.createElement("label");
    label.classList.add("configuration");
    flexItem.append(label);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    input.id = getSourceCheckboxId(source);
    input.classList.add("hidden");
    input.addEventListener("input", e => searchParams.set(getSourceSearchParamKey(source), e.target.checked.toString()));
    label.append(input);
    const text = document.createElement("div");
    text.append(source);
    label.append(text);
}

function addSourceOutputs(source) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");
    sourcesOutputs.append(flexItem);
    const outputsContainer = document.createElement("div");
    outputsContainer.id = getSourceOutputsId(source);
    outputsContainer.classList.add("animations-container");
    outputsContainer.classList.add("flex-column");
    outputsContainer.classList.add("flex-center");
    flexItem.append(outputsContainer);
}

function addSourceErrors(source) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");
    sourcesErrors.append(flexItem);
    const errorsContainer = document.createElement("div");
    errorsContainer.id = getSourceErrorsId(source);
    errorsContainer.classList.add("errors-container");
    errorsContainer.classList.add("flex-column");
    errorsContainer.classList.add("flex-center");
    flexItem.append(errorsContainer);
}

function addSource(source) {
    addSourceCheckbox(source);
    addSourceOutputs(source);
    addSourceErrors(source);
    sources.push(source);
}

export function setupSources(sources) {
    for (const source of sources) {
        addSource(source);
        const searchParamKey = getSourceSearchParamKey(source);
        const searchParamValue = searchParams.get(searchParamKey);
        const currentValue = searchParamValue !== "false";
        document.getElementById(getSourceCheckboxId(source)).checked = currentValue;
        searchParams.set(searchParamKey, currentValue);
    }
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

export function getErrorsContainer(source) {
    return document.getElementById(getSourceErrorsId(source));
}
