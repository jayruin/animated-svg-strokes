import { searchParams } from "./url-snapshot.js";

const hiddenClass = "hidden";

function parseSearchParamBoolean(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
}

function parseSearchParamColor(value) {
    if (/^[0-9a-f]{6}$/.test(value)) return `#${value}`;
    return null;
}

function parseSearchParamNumber(value) {
    if (value === null) return null;
    const parsed = parseFloat(value.replace("_", "."));
    if (!isNaN(parsed) && isFinite(parsed)) return parsed;
    return null;
}

function propertyNameToKey(propertyName) {
    return propertyName.split(/([A-Z][a-z0-9]+)/)
        .filter(s => s.length > 0)
        .map(s => s.toLowerCase())
        .join("-");
}

const propertiesKeysInputs = [];

export function setupAnimationOptions(defaultOptions) {
    const propertyNames = Object.keys(defaultOptions);
    for (const propertyName of propertyNames) {
        const key = propertyNameToKey(propertyName);
        const input = document.getElementById(`${key}-input`);
        propertiesKeysInputs.push([propertyName, key, input]);
    }

    for (const [propertyName, key, input] of propertiesKeysInputs) {
        let inputHandler = null;
        switch (input.type) {
            case "checkbox":
                inputHandler = e => searchParams.set(key, e.target.checked.toString());
                input.checked = parseSearchParamBoolean(searchParams.get(key)) ?? defaultOptions[propertyName];
                break;
            case "color":
                inputHandler = e => searchParams.set(key, e.target.value.slice(1));
                input.value = parseSearchParamColor(searchParams.get(key)) ?? defaultOptions[propertyName];
                break;
            case "number":
                inputHandler = e => searchParams.set(key, e.target.value.replace(".", "_"));
                input.value = parseSearchParamNumber(searchParams.get(key)) ?? defaultOptions[propertyName];
                break;
        }
        if (inputHandler !== null) {
            input.addEventListener("input", inputHandler);
        }
        const keyParts = key.split("-");
        if (keyParts[0] === "include" && input.type === "checkbox") {
            const elementsToToggle = propertiesKeysInputs.filter(([,k,]) => {
                const kParts = k.split("-");
                return keyParts.slice(1).every(p => kParts.includes(p)) && k !== key;
            }).map(([,,i]) => i);
            if (elementsToToggle.length > 0) {
                input.addEventListener("input", e => elementsToToggle.forEach(i => {
                    const container = i.parentElement.parentElement;
                    e.target.checked ? container.classList.remove(hiddenClass) : container.classList.add(hiddenClass);
                }));
            }
        }
        input.dispatchEvent(new Event("input"));
    }
}

export function getAnimationOptions() {
    const result = {};
    for (const [propertyName,,input] of propertiesKeysInputs) {
        switch (input.type) {
            case "checkbox":
                result[propertyName] = input.checked;
                break;
            case "color":
                result[propertyName] = input.value;
                break;
            case "number":
                result[propertyName] = parseFloat(input.value);
                break;
        }
    }
    return result;
}

const toggleOptionsButton = document.getElementById("toggle-options-button");
const optionsContainer = document.getElementById("options-container");
toggleOptionsButton.addEventListener("click", () => optionsContainer.classList.toggle(hiddenClass));
