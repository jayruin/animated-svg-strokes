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

export async function zhSVG(character) {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data/${character}.json`;
    const response = await fetch(url);
    const data = await response.json();

    const viewBox = "0 0 1024 1024";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", viewBox);

    const [ , , width, height,] = viewBox.split(" ").map(value => parseInt(value));
    svg.appendChild(createLine(width / 2, 0, width / 2, height, "#DDD"));
    svg.appendChild(createLine(0, height / 2, width, height / 2, "#DDD"));

    const group = document.createElementNS(svgNS, "g");
    group.setAttributeNS(null, "transform", "scale(1, -1) translate(0, -900)");
    svg.appendChild(group);

    const medianPathLengths = [];

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
        medianPath.setAttributeNS(null, "id", `animation-${strokeNum}`);
        medianPath.setAttributeNS(null, "fill", "none");
        medianPath.setAttributeNS(null, "stroke", "black");
        medianPath.setAttributeNS(null, "stroke-linecap", "round");
        group.appendChild(medianPath);
    }

    const style = document.createElementNS(svgNS, "style");
    const parts = [];
    const totalStrokeDuration = 1;
    const pauseRatio = 0.2;
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const strokeWidth = 128;
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum++) {
        const medianPathLength = medianPathLengths[strokeNum];
        const startPercent = (strokeNum / numberOfStrokes) * 100;
        const endPercent = ((strokeNum + (1 - pauseRatio)) / numberOfStrokes) * 100;
        const inactiveTimeBefore = strokeNum * totalStrokeDuration;

        parts.push(`@keyframes dash-${strokeNum}`);
        parts.push("{");
        if (inactiveTimeBefore > 0) {
            parts.push(`0% { stroke-dasharray: 0 ${medianPathLength}; }`);
        }
        parts.push(`${startPercent}% { stroke-dasharray: 0 ${medianPathLength}; animation-timing-function: linear; }`);
        parts.push(`${endPercent}% { stroke-dasharray: ${medianPathLength} 0; }`);
        parts.push(`100% { stroke-dasharray: ${medianPathLength} 0; }`);
        parts.push("}");

        parts.push(`@keyframes width-${strokeNum}`);
        parts.push("{");
        if (inactiveTimeBefore > 0) {
            parts.push(`0% { stroke-width: 0; animation-timing-function: steps(1, end); }`);
        }
        parts.push(`${startPercent}% { stroke-width: ${strokeWidth}; }`);
        parts.push(`${endPercent}% { stroke-width: ${strokeWidth}; }`);
        parts.push(`100% { stroke-width: ${strokeWidth}; }`);
        parts.push("}");

        parts.push(`#animation-${strokeNum} { animation: dash-${strokeNum} ${totalDuration}s infinite, width-${strokeNum} ${totalDuration}s infinite; }`);
    }
    style.appendChild(document.createTextNode(parts.join(" ")));
    group.appendChild(style);

    return svg;
}