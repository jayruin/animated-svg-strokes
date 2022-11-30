import type { AnimationOptions, CharacterInfo, Point, } from "./interfaces";

const svgNS = "http://www.w3.org/2000/svg";

const createLine = (startPoint: Point, endPoint: Point, stroke: string): SVGLineElement => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttributeNS(null, "x1", startPoint.x.toString());
    line.setAttributeNS(null, "y1", startPoint.y.toString());
    line.setAttributeNS(null, "x2", endPoint.x.toString());
    line.setAttributeNS(null, "y2", endPoint.y.toString());
    line.setAttributeNS(null, "stroke", stroke);
    line.setAttributeNS(null, "stroke-width", "1%");
    return line;
}

const drawGrid = (svg: SVGSVGElement): void => {
    const viewBox = svg.getAttribute("viewBox");
    if (viewBox === null) {
        throw new Error("svg element has no viewBox");
    }
    const [ , , width, height,] = viewBox.split(" ").map(value => parseInt(value, 10));
    svg.appendChild(createLine({ x: width / 2, y: 0, }, { x: width / 2, y: height}, "#DDD"));
    svg.appendChild(createLine({ x: 0, y: height / 2, }, { x: width, y: height / 2, }, "#DDD"));
}

const createStyle = (strokePathLengths: number[], strokePathIds: string[], strokeWidth: number, totalStrokeDuration: number, pauseRatio: number): SVGStyleElement => {
    const numberOfStrokes = Math.min(strokePathLengths.length, strokePathIds.length);
    const style = document.createElementNS(svgNS, "style");
    const parts: string[] = [];
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum += 1) {
        const strokePathLength = strokePathLengths[strokeNum];
        const strokePathId = strokePathIds[strokeNum];
        const startPercent = (strokeNum / numberOfStrokes) * 100;
        const endPercent = ((strokeNum + (1 - pauseRatio)) / numberOfStrokes) * 100;
        const inactiveTimeBefore = strokeNum * totalStrokeDuration;

        parts.push(`@keyframes dash-${strokePathId}`);
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

        parts.push(`@keyframes width-${strokePathId}`);
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

        parts.push(`#${strokePathId} { animation: dash-${strokePathId} ${totalDuration}s infinite, width-${strokePathId} ${totalDuration}s infinite; }`);
    }
    style.appendChild(document.createTextNode(parts.join(" ")));

    return style;
}

export const svgStrokes = (characterInfo: CharacterInfo, options: AnimationOptions): SVGSVGElement => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", characterInfo.viewBox);

    if (options.includeGrid) {
        drawGrid(svg);
    }

    const group = document.createElementNS(svgNS, "g");
    if (characterInfo.transform !== null) {
        group.setAttributeNS(null, "transform", characterInfo.transform);
    }
    svg.appendChild(group);

    const strokePathLengths: number[] = [];
    const strokePathIds: string[] = [];
    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeInfo = characterInfo.strokes[strokeNumber];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", strokeInfo.strokePath);
        strokePathLengths.push(Math.ceil(strokePath.getTotalLength()));

        if (strokeInfo.clipPath !== null) {
            const clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", `${characterInfo.type}-clipPath-${strokeNumber}`);
            group.appendChild(clipPathElement);

            const clipPath = document.createElementNS(svgNS, "path");
            clipPath.setAttributeNS(null, "d", strokeInfo.clipPath);
            clipPathElement.appendChild(clipPath);

            strokePath.setAttributeNS(null, "clip-path", `url(#${characterInfo.type}-clipPath-${strokeNumber})`);
        }

        const strokePathId = `${characterInfo.type}-strokePath-${strokeNumber}`;
        strokePathIds.push(strokePathId);
        strokePath.setAttributeNS(null, "id", strokePathId);
        strokePath.setAttributeNS(null, "fill", "none");
        strokePath.setAttributeNS(null, "stroke", "#000");
        strokePath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");
        group.appendChild(strokePath);
    }

    const style = createStyle(strokePathLengths, strokePathIds, characterInfo.strokeWidth, options.totalStrokeDuration, options.pauseRatio);
    group.appendChild(style);

    return svg;
}