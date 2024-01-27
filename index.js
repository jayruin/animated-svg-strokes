// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes, getSources, getFormats, getFullOptions } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/strokes.js";

import { addSource } from "./sources.js";
import { addFormat } from "./formats.js";

import { setAnimationOptions } from "./options.js";

import { setupRenderButton } from "./render-button.js";
import { setupTrashButton } from "./trash-button.js";
import { setupTheme } from "./theme.js";

Array.from(getSources()).reverse().forEach(source => addSource(source));
Array.from(getFormats()).reverse().forEach(format => addFormat(format));

setAnimationOptions(getFullOptions());

setupTrashButton(document.getElementById("trash-button"));

setupRenderButton(document.getElementById("render-button"), document.getElementById("character-input"), strokes);

setupTheme(document.getElementById("toggle-theme-button"));
