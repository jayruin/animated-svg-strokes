import { searchParams } from "./url-snapshot.js";

const searchParamKey = "characters";

const characterInput = document.getElementById("character-input");
characterInput.addEventListener("input", e => searchParams.set(searchParamKey, e.target.value));

if (!searchParams.has(searchParamKey)) {
    searchParams.set(searchParamKey, "");
} else {
    characterInput.value = searchParams.get(searchParamKey);
}

export function getCharacters() {
    return [...characterInput.value]
}
