import type { AnimationOptions, SvgAnimator } from "./types";
import type { CharacterInfo } from "../characters/types";
import { animateStrokesSvgBase } from "./svg-base";
import { svgNS } from "../svg/constants";

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
    style.append(parts.join(" "));

    return style;
};

export const FORMAT_SVG_CSS = "svg-css";

export const animateStrokesSvgCss: SvgAnimator = (characterInfo, options) => {
    const { svg, group, strokesComponents } = animateStrokesSvgBase(characterInfo, options);

    const strokePathIds: string[] = [];
    const animatedElements: SVGElement[] = [];
    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeComponents = strokesComponents[strokeNumber];

        const strokePathId = `${characterInfo.character}-${characterInfo.source}-strokePath-${strokeNumber}`;
        strokePathIds.push(strokePathId);
        strokeComponents.strokePath.setAttributeNS(null, "id", strokePathId);
        animatedElements.push(strokeComponents.strokePath);
    }

    const style = createStyle(characterInfo, strokePathIds, options);
    group.append(style);

    if (options.interactive) {
        const togglePause = (): void => {
            animatedElements.forEach((e) => {
                const paused = e.style.animationPlayState === "paused";
                e.style.animationPlayState = paused ? "running" : "paused";
            });
        };
        svg.addEventListener("click", togglePause);
    }

    return svg;
};
