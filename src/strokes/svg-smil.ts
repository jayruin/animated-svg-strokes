import type { AnimationOptions, CharacterInfo } from "./interfaces";
import { drawGrid, svgNS } from "./svg";

const animateStrokeDasharray = (characterInfo: CharacterInfo, options: AnimationOptions, strokeIndex: number): SVGAnimateElement => {
    const { strokes } = characterInfo;
    const { pauseRatio, totalStrokeDuration } = options;
    const { strokePathLength } = strokes[strokeIndex];
    const numberOfStrokes = strokes.length;

    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const start = strokeIndex / numberOfStrokes;
    const end = (strokeIndex + (1 - pauseRatio)) / numberOfStrokes;
    const inactiveTimeBefore = strokeIndex * totalStrokeDuration;
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

const animateStrokeWidth = (characterInfo: CharacterInfo, options: AnimationOptions, strokeIndex: number): SVGAnimateElement => {
    const { strokeWidth, strokes } = characterInfo;
    const { pauseRatio, totalStrokeDuration } = options;
    const numberOfStrokes = strokes.length;

    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const start = strokeIndex / numberOfStrokes;
    const end = (strokeIndex + (1 - pauseRatio)) / numberOfStrokes;
    const inactiveTimeBefore = strokeIndex * totalStrokeDuration;
    const keyTimes: string[] = [];
    const values: string[] = [];
    if (inactiveTimeBefore > 0) {
        keyTimes.push("0");
        values.push(`0`);
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

export const svgStrokesSmil = (characterInfo: CharacterInfo, options: AnimationOptions): SVGSVGElement => {
    const { character, strokes, transform, type, viewBox } = characterInfo;
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", viewBox);

    if (options.includeGrid) {
        drawGrid(svg);
    }

    const group = document.createElementNS(svgNS, "g");
    if (transform !== null) {
        group.setAttributeNS(null, "transform", transform);
    }
    svg.appendChild(group);

    for (let strokeIndex = 0; strokeIndex < strokes.length; strokeIndex += 1) {
        const { clipPath, strokePath } = strokes[strokeIndex];

        const path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "d", strokePath);
        if (clipPath !== null) {
            const clipPathId = `${character}-${type}-clipPath-${strokeIndex}`;
            path.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);

            const clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            group.appendChild(clipPathElement);

            const clipPathPathElement = document.createElementNS(svgNS, "path");
            clipPathPathElement.setAttributeNS(null, "d", clipPath);
            clipPathElement.appendChild(clipPathPathElement);
        }
        path.setAttributeNS(null, "fill", "none");
        path.setAttributeNS(null, "stroke", "#000");
        path.setAttributeNS(null, "stroke-linecap", "round");
        path.setAttributeNS(null, "stroke-linejoin", "round");

        path.appendChild(animateStrokeDasharray(characterInfo, options, strokeIndex));
        path.appendChild(animateStrokeWidth(characterInfo, options, strokeIndex));

        group.appendChild(path);
    }

    const togglePause = (): void => {
        const paused = svg.animationsPaused();
        if (paused) {
            svg.unpauseAnimations();
        } else {
            svg.pauseAnimations();
        }
    };
    svg.addEventListener("click", togglePause);

    return svg;
};
