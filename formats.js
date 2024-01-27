import { searchParams } from "./url-snapshot.js";

const strokesFormat = document.getElementById("strokes-format");
strokesFormat.addEventListener("input", e => searchParams.set(searchParamKey, e.target.value));

const searchParamKey = "format";

function addFormat(format) {
    const option = document.createElement("option");
    option.value = format;
    option.append(format);
    strokesFormat.append(option);
}

export function setupFormats(formats) {
    const searchParamValue = searchParams.get(searchParamKey);
    for (const format of formats) {
        addFormat(format);
        if (format === searchParamValue) {
            strokesFormat.value = format;
        }
    }
    searchParams.set(searchParamKey, strokesFormat.value);
}

export function getSelectedFormat() {
    return strokesFormat.value;
}
