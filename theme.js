import { getAllSources, getOutputsContainer } from "./sources.js";
import { searchParams } from "./url-snapshot.js";

const searchParamKey = "theme";

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
    document.querySelectorAll("img").forEach(i => i.style.filter = filter);
    searchParams.set(searchParamKey, isDark ? "dark" : "light");
}

function prefersDarkSchemeQuery() {
    return window.matchMedia("(prefers-color-scheme: dark)");
}

function setPreferredTheme() {
    if (prefersDarkSchemeQuery().matches) {
        isDark = true;
    } else {
        isDark = false;
    }
}

function renderPreferredTheme() {
    setPreferredTheme();
    renderTheme();
}

export function setupTheme(toggleThemeButton) {
    toggleThemeButton.addEventListener("click", () => {
        isDark = !isDark;
        renderTheme();
    });

    prefersDarkSchemeQuery().addEventListener("change", renderPreferredTheme);

    const searchParamValue = searchParams.get(searchParamKey);

    if (searchParamValue === "dark") {
        isDark = true;
    }  else if (searchParamValue === "light") {
        isDark = false;
    } else {
        setPreferredTheme();
    }

    renderTheme();
}
