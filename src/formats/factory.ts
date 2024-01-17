import type { StrokesAnimator, StrokesFormat } from "./types.js";
import { FORMAT_CANVAS_2D, animateStrokesCanvas2d } from "./canvas-2d.js";
import { FORMAT_SVG_CSS, animateStrokesSvgCss } from "./svg-css.js";
import { FORMAT_SVG_SMIL, animateStrokesSvgSmil } from "./svg-smil.js";
import { FORMAT_SVG_WA, animateStrokesSvgWa } from "./svg-wa.js";

const formats: ReadonlyMap<StrokesFormat, StrokesAnimator> = new Map<StrokesFormat, StrokesAnimator>([
    [FORMAT_CANVAS_2D, animateStrokesCanvas2d],
    [FORMAT_SVG_CSS, animateStrokesSvgCss],
    [FORMAT_SVG_SMIL, animateStrokesSvgSmil],
    [FORMAT_SVG_WA, animateStrokesSvgWa],
]);

export const getFormats = (): ReadonlySet<StrokesFormat> => Object.freeze(new Set<StrokesFormat>(formats.keys()));

export const getAnimator = (format: StrokesFormat): StrokesAnimator => {
    const animate = formats.get(format);
    if (typeof animate === "undefined") throw new Error("Unsupported format.");
    return animate;
};
