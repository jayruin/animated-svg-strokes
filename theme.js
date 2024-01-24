import { getAllSources, getOutputsContainer } from "./sources.js";


let isDark = false;

function renderTheme() {
    const root = document.documentElement;
    let color;
    let backgroundColor;
    let filter;
    if (isDark) {
        root.style.setProperty("--color", "white");
        color = "white";
        backgroundColor = "black"
        root.style.setProperty("--background-color", "black");
        filter = "invert(100%)";
    } else {
        color = "black";
        backgroundColor = "white"
        filter = "";
    }
    root.style.setProperty("--color", color);
    root.style.setProperty("--background-color", backgroundColor);
    getAllSources().map(source => getOutputsContainer(source)).forEach(container => container.style.filter = filter);
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

export function setupTheme(toggleThemeButton) {
    toggleThemeButton.addEventListener("click", () => {
        isDark = !isDark;
        renderTheme();
    });

    prefersDarkSchemeQuery().addEventListener("change", renderPreferredTheme);

    renderPreferredTheme();
}
