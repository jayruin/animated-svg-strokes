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

type StrokesType = "ja" | "zh";

type CanvasOutputFormat = "canvas";

type SvgOutputFormat = "svg-css" | "svg-smil" | "svg-wa" | "svg";

type StrokesOutputFormat = CanvasOutputFormat | SvgOutputFormat;

interface StrokesAnimatorFactory {
    (outputFormat: CanvasOutputFormat): CanvasAnimator;
    (outputFormat: SvgOutputFormat): SvgAnimator;
    (outputFormat: StrokesOutputFormat): StrokesAnimator;
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
    (type: StrokesType, outputFormat: CanvasOutputFormat, userOptions?: UserAnimationOptions): CanvasRenderer;
    (type: StrokesType, outputFormat: SvgOutputFormat, userOptions?: UserAnimationOptions): SvgRenderer;
    (type: StrokesType, outputFormat: StrokesOutputFormat, userOptions?: UserAnimationOptions): StrokesRenderer;
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

const getLoader = (type: string): CharacterLoader => {
    switch (type) {
        case "zh":
            return zhLoad;
        case "ja":
            return jaLoad;
        default:
            throw new Error("Unsupported type!");
    }
};

// Remove any return types when typescript supports overloading for arrow functions

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAnimator: StrokesAnimatorFactory = (outputFormat: StrokesOutputFormat): any => {
    switch (outputFormat) {
        case "svg-css":
            return animateStrokesSvgCss;
        case "svg-wa":
            return animateStrokesSvgWa;
        case "svg-smil":
        case "svg":
            return animateStrokesSvgSmil;
        case "canvas":
            return animateStrokesCanvas;
        default:
            throw new Error("Unsupported output!");
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const strokes: StrokesRendererFactory = (type: StrokesType, outputFormat: StrokesOutputFormat, userOptions?: UserAnimationOptions): any => {
    const options = parseUserOptions(userOptions);
    const load = getLoader(type);
    const animate = getAnimator(outputFormat);
    const render = async (character: string): Promise<Element> => {
        validateCharacter(character);
        const characterInfo = await load(character);
        return animate(characterInfo, options);
    };
    return render;
};
