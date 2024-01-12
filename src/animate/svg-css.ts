import type { AnimationOptions, SvgAnimator } from "./types";
import type { Character } from "../characters/types";
import { animateStrokesSvgBase } from "./svg-base";
import { svgNS } from "../svg/constants";
import { getPathLength } from "../svg/path";

export const FORMAT_SVG_CSS = "svg-css";

const isKeyframesRule = (rule: unknown): rule is CSSKeyframesRule => rule instanceof CSSKeyframesRule;

const createStyle = (character: Character, strokePathIds: string[], options: AnimationOptions): SVGStyleElement => {
    const { strokes } = character;
    const { pauseRatio, totalStrokeDuration } = options;
    const numberOfStrokes = Math.min(strokes.length, strokePathIds.length);
    const style = document.createElementNS(svgNS, "style");
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const styleSheet = new CSSStyleSheet();
    for (let strokeNum = 0; strokeNum < numberOfStrokes; strokeNum += 1) {
        const { strokePath, strokeWidth } = strokes[strokeNum];
        const strokePathLength = getPathLength(strokePath);
        const strokePathId = strokePathIds[strokeNum];
        const startPercent = (strokeNum / numberOfStrokes) * 100;
        const endPercent = ((strokeNum + (1 - pauseRatio)) / numberOfStrokes) * 100;
        const inactiveTimeBefore = strokeNum * totalStrokeDuration;

        const keyframesDash = styleSheet.cssRules[styleSheet.insertRule(`@keyframes dash-${strokePathId} {}`, styleSheet.cssRules.length)];
        if (!isKeyframesRule(keyframesDash)) {
            throw new TypeError("keyframesDash must be a CSSKeyframesRule.");
        }
        if (inactiveTimeBefore > 0) {
            keyframesDash.appendRule(`0% { stroke-dasharray: 0 ${strokePathLength}; }`);
        }
        keyframesDash.appendRule(`${startPercent}% { stroke-dasharray: 0 ${strokePathLength}; animation-timing-function: linear; }`);
        if (endPercent < 100) {
            keyframesDash.appendRule(`${endPercent}% { stroke-dasharray: ${strokePathLength} 0; }`);
        }
        keyframesDash.appendRule(`100% { stroke-dasharray: ${strokePathLength} 0; }`);

        const keyframesWidth = styleSheet.cssRules[styleSheet.insertRule(`@keyframes width-${strokePathId} {}`, styleSheet.cssRules.length)];
        if (!isKeyframesRule(keyframesWidth)) {
            throw new TypeError("keyframesWidth must be a CSSKeyframesRule.");
        }
        if (inactiveTimeBefore > 0) {
            keyframesWidth.appendRule("0% { stroke-width: 0; animation-timing-function: steps(1, end); }");
        }
        keyframesWidth.appendRule(`${startPercent}% { stroke-width: ${strokeWidth}; }`);
        if (endPercent < 100) {
            keyframesWidth.appendRule(`${endPercent}% { stroke-width: ${strokeWidth}; }`);
        }
        keyframesWidth.appendRule(`100% { stroke-width: ${strokeWidth}; }`);

        styleSheet.insertRule(`#${strokePathId} { animation: dash-${strokePathId} ${totalDuration}s infinite, width-${strokePathId} ${totalDuration}s infinite; }`, styleSheet.cssRules.length);
    }

    style.append(Array.from(styleSheet.cssRules).map((rule) => rule.cssText).join("\n"));

    return style;
};

export const animateStrokesSvgCss: SvgAnimator = (character, options) => {
    const { svg, group, strokesComponents } = animateStrokesSvgBase(character, options);

    const strokePathIds: string[] = [];
    const animatedElements: SVGElement[] = [];
    for (let strokeNumber = 0; strokeNumber < character.strokes.length; strokeNumber += 1) {
        const strokeComponents = strokesComponents[strokeNumber];

        const strokePathId = `strokePath-${character.codePoint}-${character.source}-${strokeNumber}`;
        strokePathIds.push(strokePathId);
        strokeComponents.strokePath.setAttributeNS(null, "id", strokePathId);
        animatedElements.push(strokeComponents.strokePath);
    }

    const style = createStyle(character, strokePathIds, options);
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
