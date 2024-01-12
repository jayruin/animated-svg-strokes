import type { AnimationOptions, StrokesFormat, CanvasFormat, SvgFormat } from "./animate/types";
import type { StrokesSource } from "./load/types";
import { getAnimator } from "./animate/factory";
import { validateOptions } from "./animate/validate-options";
import { getCodePoint } from "./characters/code-point";
import { getLoader } from "./load/factory";

export { getFormats } from "./animate/factory";
export { getSources } from "./load/factory";

interface CanvasRenderer {
    (character: string): Promise<HTMLCanvasElement>;
}

interface SvgRenderer {
    (character: string): Promise<SVGSVGElement>;
}

interface StrokesRenderer {
    (character: string): Promise<Element>;
}

interface StrokesRendererFactory {
    (source: StrokesSource, format: CanvasFormat, partialOptions?: Partial<AnimationOptions>): CanvasRenderer;
    (source: StrokesSource, format: SvgFormat, partialOptions?: Partial<AnimationOptions>): SvgRenderer;
    (source: StrokesSource, format: StrokesFormat, partialOptions?: Partial<AnimationOptions>): StrokesRenderer;
}

const defaultOptions: AnimationOptions = {
    includeGrid: true,
    gridColor: "#dddddd",
    gridRows: 2,
    gridColumns: 2,
    strokeColor: "#000000",
    includeBackground: false,
    backgroundColor: "#ffffff",
    pauseRatio: 0.2,
    totalStrokeDuration: 1,
    interactive: true,
};

export const getFullOptions = (partialOptions?: Partial<AnimationOptions>): AnimationOptions => {
    const options = { ...defaultOptions, ...partialOptions };
    validateOptions(options);
    return options;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const strokes: StrokesRendererFactory = (source: StrokesSource, format: StrokesFormat, partialOptions?: Partial<AnimationOptions>): any => {
    const options = getFullOptions(partialOptions);
    const load = getLoader(source);
    const animate = getAnimator(format);
    const render = async (characterString: string): Promise<Element> => {
        const characterCodePoint = getCodePoint(characterString);
        const character = await load(characterCodePoint);
        return animate(character, options);
    };
    return render;
};
