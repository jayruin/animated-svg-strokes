import type { AnimationOptions, StrokesFormat, CanvasFormat, SvgFormat } from "./animate/types";
import type { StrokesSource } from "./load/types";
import { getAnimator } from "./animate/factory";
import { getFullOptions } from "./animate/options";
import { getCodePoint } from "./characters/code-point";
import { getLoader } from "./load/factory";

export { getFullOptions };

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
