const svgNS = "http://www.w3.org/2000/svg";

function createLine(x1, y1, x2, y2, stroke) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "y1", y1);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y2", y2);
    line.setAttributeNS(null, "stroke", stroke);
    line.setAttributeNS(null, "stroke-width", "1%");
    return line;
}

function drawGrid(svg) {
    const viewBox = svg.getAttribute("viewBox");
    const [ , , width, height,] = viewBox.split(" ").map(value => parseInt(value));
    svg.appendChild(createLine(width / 2, 0, width / 2, height, "#DDD"));
    svg.appendChild(createLine(0, height / 2, width, height / 2, "#DDD"));
}

function createStyle(strokePathLengths, strokeIds, strokeWidth, totalStrokeDuration, pauseRatio) {
    const numberOfStrokes = Math.min(strokePathLengths.length, strokeIds.length);
    const style = document.createElementNS(svgNS, "style");
    const parts = [];
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum++) {
        const strokePathLength = strokePathLengths[strokeNum];
        const strokeId = strokeIds[strokeNum];
        const startPercent = (strokeNum / numberOfStrokes) * 100;
        const endPercent = ((strokeNum + (1 - pauseRatio)) / numberOfStrokes) * 100;
        const inactiveTimeBefore = strokeNum * totalStrokeDuration;

        parts.push(`@keyframes dash-${strokeId}`);
        parts.push("{");
        if (inactiveTimeBefore > 0) {
            parts.push(`0% { stroke-dasharray: 0 ${strokePathLength}; }`);
        }
        parts.push(`${startPercent}% { stroke-dasharray: 0 ${strokePathLength}; animation-timing-function: linear; }`);
        if (endPercent < 100) {
            parts.push(`${endPercent}% { stroke-dasharray: ${strokePathLength} 0; }`);
        }
        parts.push(`100% { stroke-dasharray: ${strokePathLength} 0; }`);
        parts.push("}");

        parts.push(`@keyframes width-${strokeId}`);
        parts.push("{");
        if (inactiveTimeBefore > 0) {
            parts.push(`0% { stroke-width: 0; animation-timing-function: steps(1, end); }`);
        }
        parts.push(`${startPercent}% { stroke-width: ${strokeWidth}; }`);
        if (endPercent < 100) {
            parts.push(`${endPercent}% { stroke-width: ${strokeWidth}; }`);
        }
        parts.push(`100% { stroke-width: ${strokeWidth}; }`);
        parts.push("}");

        parts.push(`#${strokeId} { animation: dash-${strokeId} ${totalDuration}s infinite, width-${strokeId} ${totalDuration}s infinite; }`);
    }
    style.appendChild(document.createTextNode(parts.join(" ")));

    return style;
}

async function zhSVG(character, options) {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data/${character}.json`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    const viewBox = "0 0 1024 1024";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", viewBox);

    drawGrid(svg);

    const group = document.createElementNS(svgNS, "g");
    group.setAttributeNS(null, "transform", "scale(1, -1) translate(0, -900)");
    svg.appendChild(group);

    const medianPathLengths = [];
    const strokeIds = [];
    const numberOfStrokes = Math.min(data.strokes.length, data.medians.length);
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum++) {
        const stroke = data.strokes[strokeNum];
        const median = data.medians[strokeNum];

        const clipPath = document.createElementNS(svgNS, "clipPath");
        clipPath.setAttributeNS(null, "id", `clipPath-${strokeNum}`);
        group.appendChild(clipPath);
        
        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", stroke);
        clipPath.appendChild(strokePath);

        const medianPath = document.createElementNS(svgNS, "path");
        medianPath.setAttributeNS(null, "d", median.map((m, i) => [i == 0 ? "M" : "L", m[0].toString(), m[1].toString(),].join(" ")).join(" "));
        medianPathLengths.push(Math.ceil(medianPath.getTotalLength()));
        medianPath.setAttributeNS(null, "clip-path", `url(#clipPath-${strokeNum})`);
        const strokeId = `zh-stroke-${strokeNum}`;
        strokeIds.push(strokeId);
        medianPath.setAttributeNS(null, "id", strokeId);
        medianPath.setAttributeNS(null, "fill", "none");
        medianPath.setAttributeNS(null, "stroke", "#000");
        medianPath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");
        group.appendChild(medianPath);
    }

    const { totalStrokeDuration, pauseRatio, } = options;
    const strokeWidth = 128;
    const style = createStyle(medianPathLengths, strokeIds, strokeWidth, totalStrokeDuration, pauseRatio);
    group.appendChild(style);

    return svg;
}

async function jaSVG(character, options) {
    const characterFile = `${character.codePointAt(0).toString(16).padStart(5, "0")}.svg`;
    const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${characterFile}`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.text();
    const xmlDocument = new DOMParser().parseFromString(data, "image/svg+xml");
    const viewBox = xmlDocument.querySelector("svg").getAttribute("viewBox");
    const strokes = Array.from(xmlDocument.querySelectorAll("path"))
        .sort((firstEl, secondEl) => {
            const [firstNum, secondNum] = [firstEl, secondEl].map(el => parseInt(el.getAttribute("id").substring(el.getAttribute("id").indexOf("-s"))));
            return firstNum - secondNum;
        })
        .map(element => element.getAttribute("d"));

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", viewBox);

    drawGrid(svg);

    const group = document.createElementNS(svgNS, "g");
    svg.appendChild(group);

    const strokePathLengths = [];
    const strokeIds = [];
    const numberOfStrokes = strokes.length;
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum++) {
        const stroke = strokes[strokeNum];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", stroke);
        strokePathLengths.push(Math.ceil(strokePath.getTotalLength()));
        const strokeId = `ja-stroke-${strokeNum}`;
        strokeIds.push(strokeId);
        strokePath.setAttributeNS(null, "id", strokeId);
        strokePath.setAttributeNS(null, "fill", "none");
        strokePath.setAttributeNS(null, "stroke", "#000");
        strokePath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");
        group.appendChild(strokePath);
    }

    const { totalStrokeDuration, pauseRatio, } = options;
    const strokeWidth = Array.from(xmlDocument.querySelectorAll("g[style]"))
        .map(element => parseFloat(element.style.getPropertyValue("stroke-width")))
        .find(num => !isNaN(num) && isFinite(num));
    const style = createStyle(strokePathLengths, strokeIds, strokeWidth, totalStrokeDuration, pauseRatio);
    group.appendChild(style);

    return svg;
}

function validateOptions(options) {
    const defaultOptions = {
        totalStrokeDuration: 1,
        pauseRatio: 0.2,
    };
    options = { ...defaultOptions, ...options, };

    const totalStrokeDuration = parseFloat(options.totalStrokeDuration);
    if (isNaN(totalStrokeDuration)) {
        throw new RangeError("totalStrokeDuration is NaN!");
    }
    if (totalStrokeDuration <= 0) {
        throw new RangeError("totalStrokeDuration cannnot be <= 0!");
    }
    if (!isFinite(totalStrokeDuration)) {
        throw new RangeError("totalStrokeDuration must be finite!");
    }
    options.totalStrokeDuration = totalStrokeDuration;

    const pauseRatio = parseFloat(options.pauseRatio);
    if (pauseRatio < 0) {
        throw new RangeError("pauseRatio cannot be < 0!");
    }
    if (pauseRatio >= 1) {
        throw new RangeError("pauseRatio cannot be >= 1!");
    }
    if (isNaN(pauseRatio)) {
        throw new RangeError("pauseRatio is NaN!");
    }
    options.pauseRatio = pauseRatio;

    return Object.freeze(options);
}

export function strokes(lang, output, options) {
    options = validateOptions(options);
    if (lang === "zh" && output === "svg") {
        return async (char) => await zhSVG(char, options);
    }
    if (lang === "ja" && output === "svg") {
        return async (char) => await jaSVG(char, options);
    }
    throw new Error("Unsupported lang or output!");
}