import type { CanvasAnimator, SvgAnimator, StrokesAnimator, AnimationOptions } from "./animate/types";
import type { CharacterLoader } from "./load/types";
import { animateStrokesCanvas } from "./animate/canvas";
import { animateStrokesSvgCss } from "./animate/svg-css";
import { animateStrokesSvgSmil } from "./animate/svg-smil";
import { animateStrokesSvgWa } from "./animate/svg-wa";
import { validateOptions } from "./animate/validate-options";
import { validateCharacter } from "./characters/validate-character";
import { zhLoad } from "./load/zh";
import { jaLoad } from "./load/ja";

interface UserAnimationOptions {
    readonly includeGrid?: boolean;
    readonly gridColor?: string;
    readonly gridRows?: number;
    readonly gridColumns?: number;
    readonly strokeColor?: string;
    readonly backgroundColor?: string;
    readonly pauseRatio?: number;
    readonly totalStrokeDuration?: number;
    readonly interactive?: boolean;
}

const SOURCE_JA = "ja";
const SOURCE_ZH = "zh";

const FORMAT_SVG_SMIL = "svg-smil";
const FORMAT_SVG_CSS = "svg-css";
const FORMAT_SVG_WA = "svg-wa";
const FORMAT_CANVAS = "canvas";

type StrokesSource = typeof SOURCE_JA | typeof SOURCE_ZH;

type CanvasFormat = typeof FORMAT_CANVAS;

type SvgFormat = typeof FORMAT_SVG_CSS | typeof FORMAT_SVG_SMIL | typeof FORMAT_SVG_WA;

type StrokesFormat = CanvasFormat | SvgFormat;

interface StrokesAnimatorFactory {
    (format: CanvasFormat): CanvasAnimator;
    (format: SvgFormat): SvgAnimator;
    (format: StrokesFormat): StrokesAnimator;
}

interface CanvasRenderer {
    (character: string): Promise<HTMLCanvasElement>;
}

interface SvgRenderer {
    (character: string): Promise<SVGElement>;
}

interface StrokesRenderer {
    (character: string): Promise<Element>;
}

interface StrokesRendererFactory {
    (source: StrokesSource, format: CanvasFormat, userOptions?: UserAnimationOptions): CanvasRenderer;
    (source: StrokesSource, format: SvgFormat, userOptions?: UserAnimationOptions): SvgRenderer;
    (source: StrokesSource, format: StrokesFormat, userOptions?: UserAnimationOptions): StrokesRenderer;
}

const parseUserOptions = (userOptions?: UserAnimationOptions): AnimationOptions => {
    const options = {
        includeGrid: userOptions?.includeGrid ?? true,
        gridColor: userOptions?.gridColor ?? "#dddddd",
        gridRows: userOptions?.gridRows ?? 2,
        gridColumns: userOptions?.gridColumns ?? 2,
        strokeColor: userOptions?.strokeColor ?? "#000000",
        backgroundColor: userOptions?.backgroundColor ?? null,
        pauseRatio: userOptions?.pauseRatio ?? 0.2,
        totalStrokeDuration: userOptions?.totalStrokeDuration ?? 1,
        interactive: userOptions?.interactive ?? true,
    };
    validateOptions(options);
    return options;
};

const getLoader = (source: StrokesSource): CharacterLoader => {
    switch (source) {
        case SOURCE_JA:
            return jaLoad;
        case SOURCE_ZH:
            return zhLoad;
        default:
            throw new Error("Unsupported source!");
    }
};

// Remove any return types when typescript supports overloading for arrow functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAnimator: StrokesAnimatorFactory = (format: StrokesFormat): any => {
    switch (format) {
        case FORMAT_SVG_SMIL:
            return animateStrokesSvgSmil;
        case FORMAT_SVG_CSS:
            return animateStrokesSvgCss;
        case FORMAT_SVG_WA:
            return animateStrokesSvgWa;
        case FORMAT_CANVAS:
            return animateStrokesCanvas;
        default:
            throw new Error("Unsupported format!");
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const strokes: StrokesRendererFactory = (source: StrokesSource, format: StrokesFormat, userOptions?: UserAnimationOptions): any => {
    const options = parseUserOptions(userOptions);
    const load = getLoader(source);
    const animate = getAnimator(format);
    const render = async (character: string): Promise<Element> => {
        validateCharacter(character);
        const characterInfo = await load(character);
        return animate(characterInfo, options);
    };
    return render;
};

export const getSources = (): ReadonlySet<StrokesSource> => Object.freeze(new Set<StrokesSource>([SOURCE_JA, SOURCE_ZH]));

export const getFormats = (): ReadonlySet<StrokesFormat> => Object.freeze(new Set<StrokesFormat>([FORMAT_CANVAS, FORMAT_SVG_CSS, FORMAT_SVG_SMIL, FORMAT_SVG_WA]));
