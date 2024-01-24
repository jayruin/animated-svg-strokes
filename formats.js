const strokesFormat = document.getElementById("strokes-format");

export function addFormat(format) {
    const option = document.createElement("option");
    option.value = format;
    option.append(format);
    strokesFormat.append(option);
}

export function getSelectedFormat() {
    return strokesFormat.value;
}
