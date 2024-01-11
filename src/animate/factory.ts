import type { StrokesAnimatorFactory, StrokesFormat } from "./types";
import { FORMAT_CANVAS_2D, animateStrokesCanvas2d } from "./canvas-2d";
import { FORMAT_SVG_CSS, animateStrokesSvgCss } from "./svg-css";
import { FORMAT_SVG_SMIL, animateStrokesSvgSmil } from "./svg-smil";
import { FORMAT_SVG_WA, animateStrokesSvgWa } from "./svg-wa";

export const getFormats = (): ReadonlySet<StrokesFormat> => Object.freeze(new Set<StrokesFormat>([
    FORMAT_CANVAS_2D,
    FORMAT_SVG_CSS,
    FORMAT_SVG_SMIL,
    FORMAT_SVG_WA,
]));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAnimator: StrokesAnimatorFactory = (format): any => {
    switch (format) {
        case FORMAT_CANVAS_2D:
            return animateStrokesCanvas2d;
        case FORMAT_SVG_SMIL:
            return animateStrokesSvgSmil;
        case FORMAT_SVG_CSS:
            return animateStrokesSvgCss;
        case FORMAT_SVG_WA:
            return animateStrokesSvgWa;
        default:
            throw new Error("Unsupported format.");
    }
};
