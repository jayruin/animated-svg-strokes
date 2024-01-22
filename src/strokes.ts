import type { StrokesAnimation, StrokesAnimationOptions, StrokesAnimator, StrokesFormat } from "./formats/types.js";
import type { StrokesLoader, StrokesSource } from "./sources/types.js";
import { getCodePoint } from "./characters/code-point.js";
import { getAnimator } from "./formats/factory.js";
import { getFullOptions } from "./formats/options.js";
import { getLoader } from "./sources/factory.js";

export { getAnimator, getFullOptions, getLoader };

export { getFormats } from "./formats/factory.js";
export { buildLoader, getParser, getRequester, getSources } from "./sources/factory.js";

interface StrokesRenderer {
    (characterString: string): Promise<StrokesAnimation>;
}

interface StrokesRendererFactoryArguments {
    source?: StrokesSource;
    format?: StrokesFormat;
    options?: Partial<StrokesAnimationOptions>;
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
