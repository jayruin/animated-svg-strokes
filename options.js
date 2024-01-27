const hiddenClass = "hidden";

function getCheckboxHandler(...elements) {
    return e => elements.forEach(i => {
        const container = i.parentElement.parentElement;
        e.target.checked ? container.classList.remove(hiddenClass) : container.classList.add(hiddenClass);
    });
}

const includeGridInput = document.getElementById("include-grid-input");
const gridColorInput = document.getElementById("grid-color-input");
const gridRowsInput = document.getElementById("grid-rows-input");
const gridColumnsInput = document.getElementById("grid-columns-input");
includeGridInput.addEventListener("input", getCheckboxHandler(gridColorInput, gridRowsInput, gridColumnsInput));

const includeBackgroundInput = document.getElementById("include-background-input");
const backgroundColorInput = document.getElementById("background-color-input");
includeBackgroundInput.addEventListener("input", getCheckboxHandler(backgroundColorInput));

const includePreviewInput = document.getElementById("include-preview-input");
const previewColorInput = document.getElementById("preview-color-input");
includePreviewInput.addEventListener("input", getCheckboxHandler(previewColorInput));

const strokeColorInput = document.getElementById("stroke-color-input");
const pauseRatioInput = document.getElementById("pause-ratio-input");
const totalStrokeDurationInput = document.getElementById("total-stroke-duration-input");

export function getAnimationOptions() {
    return {
        includeGrid: includeGridInput.checked,
        gridColor: gridColorInput.value,
        gridRows: parseInt(gridRowsInput.value),
        gridColumns: parseInt(gridColumnsInput.value),

        includeBackground: includeBackgroundInput.checked,
        backgroundColor: backgroundColorInput.value,

        includePreview: includePreviewInput.checked,
        previewColor: previewColorInput.value,

        strokeColor: strokeColorInput.value,
        pauseRatio: parseFloat(pauseRatioInput.value),
        totalStrokeDuration: parseFloat(totalStrokeDurationInput.value),
    };
}

export function setAnimationOptions(options) {
    includeGridInput.checked = options.includeGrid;
    includeGridInput.dispatchEvent(new Event("input"));
    gridColorInput.value = options.gridColor;
    gridRowsInput.value = options.gridRows;
    gridColumnsInput.value = options.gridColumns;

    includeBackgroundInput.checked = options.includeBackground;
    includeBackgroundInput.dispatchEvent(new Event("input"));
    backgroundColorInput.value = options.backgroundColor;

    includePreviewInput.checked = options.includePreview;
    includePreviewInput.dispatchEvent(new Event("input"));
    previewColorInput.value = options.previewColor;

    strokeColorInput.value = options.strokeColor;
    pauseRatioInput.value = options.pauseRatio;
    totalStrokeDurationInput.value = options.totalStrokeDuration;
}

const toggleOptionsButton = document.getElementById("toggle-options-button");
const optionsContainer = document.getElementById("options-container");
toggleOptionsButton.addEventListener("click", () => optionsContainer.classList.toggle(hiddenClass));
