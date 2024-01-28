import type { StrokesAnimationOptions, StrokesCharacterAnimation } from "./formats/types.js";
import { getCodePoint } from "./characters/code-point.js";
import { getFormatHandler } from "./formats/factory.js";
import { getFullOptions } from "./formats/options.js";
import { getSourceHandler } from "./sources/factory.js";

export { getFullOptions };

export { getFormatComponents, getFormats, registerFormat } from "./formats/factory.js";
export { getSourceComponents, getSources, registerSource } from "./sources/factory.js";

interface StrokesRenderer {
    (characterString: string): Promise<StrokesCharacterAnimation>;
}

interface StrokesRendererFactoryArguments {
    source: string;
    format: string;
    options?: Partial<StrokesAnimationOptions>;
}

interface StrokesRendererFactory {
    (args: StrokesRendererFactoryArguments): StrokesRenderer;
}

export const strokes: StrokesRendererFactory = ({ source, format, options }) => {
    const fullOptions = getFullOptions(options);
    const sourceHandler = getSourceHandler(source);
    const formatHandler = getFormatHandler(format);
    const render: StrokesRenderer = async (characterString) => {
        const characterCodePoint = getCodePoint(characterString);
        const character = await sourceHandler(characterCodePoint);
        return formatHandler(character, fullOptions);
    };
    return render;
};
