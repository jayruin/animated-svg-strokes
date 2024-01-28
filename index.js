// Importing from github directly will fail due to incorrect mimetype of text/plain
// import { strokes } from "https://raw.githubusercontent.com/jayruin/strokes/dist/index.js";
import { strokes, getSources, getFormats, getFullOptions } from "https://cdn.jsdelivr.net/gh/jayruin/strokes@dist/strokes.js";

import { setupSources } from "./sources.js";
import { setupFormats } from "./formats.js";

import { setupAnimationOptions } from "./options.js";

import { setupRenderButton } from "./render-button.js";
import { setupTrashButton } from "./trash-button.js";
import { setupTheme } from "./theme.js";

setupSources(Array.from(getSources()).reverse());
setupFormats(Array.from(getFormats()).reverse());

setupAnimationOptions(getFullOptions());

setupTrashButton(document.getElementById("trash-button"));

setupRenderButton(document.getElementById("render-button"), strokes);

setupTheme(document.getElementById("toggle-theme-button"));
