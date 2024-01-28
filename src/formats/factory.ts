import type { StrokesFormatComponents, StrokesFormatHandler } from "./types.js";
import { FORMAT_CANVAS_2D, animateStrokesCanvas2d } from "./canvas-2d.js";
import { FORMAT_SVG_CSS, animateStrokesSvgCss } from "./svg-css.js";
import { FORMAT_SVG_SMIL, animateStrokesSvgSmil } from "./svg-smil.js";
import { FORMAT_SVG_WA, animateStrokesSvgWa } from "./svg-wa.js";

const formats: Map<string, StrokesFormatComponents> = new Map<string, StrokesFormatComponents>();

export const getFormats = (): ReadonlySet<string> => Object.freeze(new Set<string>(formats.keys()));

export const getFormatComponents = (format: string): StrokesFormatComponents => {
    const components = formats.get(format);
    if (typeof components === "undefined") throw new Error("Unsupported format.");
    return components;
};

export const registerFormat = (components: StrokesFormatComponents): void => {
    formats.set(components.format, components);
};

registerFormat({ format: FORMAT_CANVAS_2D, animator: animateStrokesCanvas2d });
registerFormat({ format: FORMAT_SVG_CSS, animator: animateStrokesSvgCss });
registerFormat({ format: FORMAT_SVG_SMIL, animator: animateStrokesSvgSmil });
registerFormat({ format: FORMAT_SVG_WA, animator: animateStrokesSvgWa });

export const getFormatHandler = (format: string): StrokesFormatHandler => {
    const { animator } = getFormatComponents(format);
    const formatHandler: StrokesFormatHandler = (character, options) => {
        const { codePoint, source, strokes, transform, viewBox } = character;
        return { ...animator({ strokes, transform, viewBox }, options), codePoint, source, format };
    };
    return formatHandler;
};
