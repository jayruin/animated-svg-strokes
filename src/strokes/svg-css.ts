import type { AnimationOptions, CharacterInfo } from "./interfaces";
import { drawGrid, svgNS } from "./svg";

const createStyle = (characterInfo: CharacterInfo, strokePathIds: string[], options: AnimationOptions): SVGStyleElement => {
    const { strokeWidth, strokes } = characterInfo;
    const { pauseRatio, totalStrokeDuration } = options;
    const numberOfStrokes = Math.min(strokes.length, strokePathIds.length);
    const style = document.createElementNS(svgNS, "style");
    const parts: string[] = [];
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum += 1) {
        const { strokePathLength } = strokes[strokeNum];
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
};

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

    const strokePathIds: string[] = [];
    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeInfo = characterInfo.strokes[strokeNumber];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", strokeInfo.strokePath);

        if (strokeInfo.clipPath !== null) {
            const clipPathId = `${characterInfo.character}-${characterInfo.type}-clipPath-${strokeNumber}`;
            const clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            group.appendChild(clipPathElement);

            const clipPath = document.createElementNS(svgNS, "path");
            clipPath.setAttributeNS(null, "d", strokeInfo.clipPath);
            clipPathElement.appendChild(clipPath);

            strokePath.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);
        }

        const strokePathId = `${characterInfo.character}-${characterInfo.type}-strokePath-${strokeNumber}`;
        strokePathIds.push(strokePathId);
        strokePath.setAttributeNS(null, "id", strokePathId);
        strokePath.setAttributeNS(null, "fill", "none");
        strokePath.setAttributeNS(null, "stroke", "#000");
        strokePath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");
        group.appendChild(strokePath);
    }

    const style = createStyle(characterInfo, strokePathIds, options);
    group.appendChild(style);

    return svg;
};
