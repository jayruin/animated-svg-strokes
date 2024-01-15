import type { AnimationOptions, StrokesAnimator, StrokesFormat } from "./formats/types";
import type { StrokesLoader, StrokesSource } from "./sources/types";
import { getCodePoint } from "./characters/code-point";
import { getAnimator } from "./formats/factory";
import { getFullOptions } from "./formats/options";
import { getLoader } from "./sources/factory";

export { getAnimator, getFullOptions, getLoader };

export { getFormats } from "./formats/factory";
export { buildLoader, getParser, getRequester, getSources } from "./sources/factory";

interface StrokesRenderer {
    (characterString: string): Promise<Element>;
}

interface StrokesRendererFactoryArguments {
    source?: StrokesSource;
    format?: StrokesFormat;
    options?: Partial<AnimationOptions>;
    loader?: StrokesLoader;
    animator?: StrokesAnimator;
}

interface StrokesRendererFactory {
    (args: StrokesRendererFactoryArguments): StrokesRenderer;
}

const chooseLoader = (source?: StrokesSource, loader?: StrokesLoader): StrokesLoader => {
    if (typeof loader === "function") return loader;
    if (typeof source === "string") return getLoader(source);
    throw new Error("Either source or loader must be provided.");
};

const chooseAnimator = (format?: StrokesFormat, animator?: StrokesAnimator): StrokesAnimator => {
    if (typeof animator === "function") return animator;
    if (typeof format === "string") return getAnimator(format);
    throw new Error("Either format or animator must be provided.");
};

export const strokes: StrokesRendererFactory = ({ source, format, options, loader, animator }) => {
    const fullOptions = getFullOptions(options);
    const load = chooseLoader(source, loader);
    const animate = chooseAnimator(format, animator);
    const render: StrokesRenderer = async (characterString) => {
        const characterCodePoint = getCodePoint(characterString);
        const character = await load(characterCodePoint);
        return animate(character, fullOptions);
    };
    return render;
};
