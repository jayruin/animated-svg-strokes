import type { AnimationOptions, SvgAnimator, WebAnimationsInfo } from "./types";
import type { CharacterInfo } from "../characters/types";
import { animateStrokesSvgBase } from "./svg-base";

const getWebAnimationsInfo = (characterInfo: CharacterInfo, options: AnimationOptions, strokeNumber: number): WebAnimationsInfo => {
    const dashKeyframes: Keyframe[] = [];
    const widthKeyframes: Keyframe[] = [];
    const { strokeWidth, strokes } = characterInfo;
    const { pauseRatio, totalStrokeDuration } = options;
    const numberOfStrokes = strokes.length;
    const totalDuration = totalStrokeDuration * numberOfStrokes;
    const { strokePathLength } = strokes[strokeNumber];
    const startOffset = strokeNumber / numberOfStrokes;
    const endOffset = (strokeNumber + (1 - pauseRatio)) / numberOfStrokes;
    const inactiveTimeBefore = strokeNumber * totalStrokeDuration;
    if (inactiveTimeBefore > 0) {
        dashKeyframes.push({ offset: 0, strokeDasharray: `0 ${strokePathLength}` });
        widthKeyframes.push({ offset: 0, strokeWidth: "0", easing: "steps(1, end)" });
    }
    dashKeyframes.push({ offset: startOffset, strokeDasharray: `0 ${strokePathLength}`, easing: "linear" });
    widthKeyframes.push({ offset: startOffset, strokeWidth: `${strokeWidth}` });
    if (endOffset < 1) {
        dashKeyframes.push({ offset: endOffset, strokeDasharray: `${strokePathLength} 0` });
        widthKeyframes.push({ offset: endOffset, strokeWidth: `${strokeWidth}` });
    }
    dashKeyframes.push({ offset: 1, strokeDasharray: `${strokePathLength} 0` });
    widthKeyframes.push({ offset: 1, strokeWidth: `${strokeWidth}` });
    const keyframeOptions = { duration: totalDuration * 1000, iterations: Infinity };
    return { dashKeyframes, widthKeyframes, keyframeOptions };
};

export const FORMAT_SVG_WA = "svg-wa";

export const animateStrokesSvgWa: SvgAnimator = (characterInfo, options) => {
    const { svg, strokesComponents } = animateStrokesSvgBase(characterInfo, options);

    const animations: Animation[] = [];
    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeComponents = strokesComponents[strokeNumber];
        const { dashKeyframes, widthKeyframes, keyframeOptions } = getWebAnimationsInfo(characterInfo, options, strokeNumber);
        const dashAnimation = strokeComponents.strokePath.animate(dashKeyframes, keyframeOptions);
        animations.push(dashAnimation);
        const strokeAnimation = strokeComponents.strokePath.animate(widthKeyframes, keyframeOptions);
        animations.push(strokeAnimation);
    }

    if (options.interactive) {
        const togglePause = (): void => {
            animations.forEach((a) => {
                const paused = a.playState === "paused";
                if (paused) {
                    a.play();
                } else {
                    a.pause();
                }
            });
        };
        svg.addEventListener("click", togglePause);
    }

    return svg;
};
