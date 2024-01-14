import type { StrokesAnimator, StrokesAnimatorFactory, StrokesFormat } from "./types";
import { FORMAT_CANVAS_2D, animateStrokesCanvas2d } from "./canvas-2d";
import { FORMAT_SVG_CSS, animateStrokesSvgCss } from "./svg-css";
import { FORMAT_SVG_SMIL, animateStrokesSvgSmil } from "./svg-smil";
import { FORMAT_SVG_WA, animateStrokesSvgWa } from "./svg-wa";

const formats: ReadonlyMap<StrokesFormat, StrokesAnimator> = new Map<StrokesFormat, StrokesAnimator>([
    [FORMAT_CANVAS_2D, animateStrokesCanvas2d],
    [FORMAT_SVG_CSS, animateStrokesSvgCss],
    [FORMAT_SVG_SMIL, animateStrokesSvgSmil],
    [FORMAT_SVG_WA, animateStrokesSvgWa],
]);

export const getFormats = (): ReadonlySet<StrokesFormat> => Object.freeze(new Set<StrokesFormat>(formats.keys()));

export const getAnimator: StrokesAnimatorFactory = (format) => {
    const animate = formats.get(format);
    if (typeof animate === "undefined") throw new Error("Unsupported format.");
    return animate;
};
