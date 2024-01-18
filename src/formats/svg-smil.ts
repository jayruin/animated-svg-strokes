import type { AnimationOptions, SvgAnimator } from "./types.js";
import type { Character } from "../characters/types.js";
import { getUniqueId } from "./id.js";
import { getStrokesSvgBase } from "./svg-base.js";
import { svgNS } from "../svg/constants.js";
import { getPathLength } from "../svg/path.js";

export const FORMAT_SVG_SMIL = "svg-smil";

const animateStrokeDasharray = (character: Character, options: AnimationOptions, strokeNumber: number): SVGAnimateElement => {
    const { strokes } = character;
    const { pauseRatio, totalStrokeDuration } = options;
    const { strokePath } = strokes[strokeNumber];
    const strokePathLength = getPathLength(strokePath);
    const numberOfStrokes = strokes.length;

    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const start = strokeNumber / numberOfStrokes;
    const end = (strokeNumber + (1 - pauseRatio)) / numberOfStrokes;
    const inactiveTimeBefore = strokeNumber * totalStrokeDuration;
    const keyTimes: string[] = [];
    const values: string[] = [];
    if (inactiveTimeBefore > 0) {
        keyTimes.push("0");
        values.push(`0 ${strokePathLength}`);
    }
    keyTimes.push(start.toString());
    values.push(`0 ${strokePathLength}`);
    if (end < 1) {
        keyTimes.push(end.toString());
        values.push(`${strokePathLength} 0`);
    }
    keyTimes.push("1");
    values.push(`${strokePathLength} 0`);

    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttributeNS(null, "attributeName", "stroke-dasharray");
    animate.setAttributeNS(null, "repeatCount", "indefinite");
    animate.setAttributeNS(null, "dur", totalDuration.toString());
    animate.setAttributeNS(null, "calcMode", "linear");
    animate.setAttributeNS(null, "keyTimes", keyTimes.join(";"));
    animate.setAttributeNS(null, "values", values.join(";"));

    return animate;
};

const animateStrokeWidth = (character: Character, options: AnimationOptions, strokeNumber: number): SVGAnimateElement => {
    const { strokes } = character;
    const { pauseRatio, totalStrokeDuration } = options;
    const numberOfStrokes = strokes.length;
    const { strokeWidth } = strokes[strokeNumber];

    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const start = strokeNumber / numberOfStrokes;
    const end = (strokeNumber + (1 - pauseRatio)) / numberOfStrokes;
    const inactiveTimeBefore = strokeNumber * totalStrokeDuration;
    const keyTimes: string[] = [];
    const values: string[] = [];
    if (inactiveTimeBefore > 0) {
        keyTimes.push("0");
        values.push("0");
    }
    keyTimes.push(start.toString());
    values.push(strokeWidth.toString());
    if (end < 1) {
        keyTimes.push(end.toString());
        values.push(strokeWidth.toString());
    }
    keyTimes.push("1");
    values.push(strokeWidth.toString());

    const animate = document.createElementNS(svgNS, "animate");
    animate.setAttributeNS(null, "attributeName", "stroke-width");
    animate.setAttributeNS(null, "repeatCount", "indefinite");
    animate.setAttributeNS(null, "dur", totalDuration.toString());
    animate.setAttributeNS(null, "calcMode", "discrete");
    animate.setAttributeNS(null, "keyTimes", keyTimes.join(";"));
    animate.setAttributeNS(null, "values", values.join(";"));

    return animate;
};

export const animateStrokesSvgSmil: SvgAnimator = (character, options) => {
    const uniqueId = getUniqueId();
    const { svg, strokesComponents } = getStrokesSvgBase(character, options, uniqueId);

    for (let strokeNumber = 0; strokeNumber < character.strokes.length; strokeNumber += 1) {
        const strokeComponents = strokesComponents[strokeNumber];

        strokeComponents.strokePath.append(animateStrokeDasharray(character, options, strokeNumber));
        strokeComponents.strokePath.append(animateStrokeWidth(character, options, strokeNumber));
    }

    if (options.interactive) {
        const togglePause = (): void => {
            const paused = svg.animationsPaused();
            if (paused) {
                svg.unpauseAnimations();
            } else {
                svg.pauseAnimations();
            }
        };
        svg.addEventListener("click", togglePause);
    }

    return svg;
};
