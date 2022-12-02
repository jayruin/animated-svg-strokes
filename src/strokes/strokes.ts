import type { CharacterLoader, Strokes, UserAnimationOptions } from "./interfaces";
import { jaLoad, zhLoad } from "./loading";
import { validateOptions } from "./options";
import { svgStrokes as svgStrokesCss } from "./svg-css";
import { svgStrokes as svgStrokesSmil } from "./svg-smil";

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

export const strokes: Strokes = (type: string, output: string, userOptions: UserAnimationOptions) => {
    const options = {
        includeGrid: typeof userOptions.includeGrid === "undefined" ? true : userOptions.includeGrid,
        pauseRatio: typeof userOptions.pauseRatio === "undefined" ? 0.2 : userOptions.pauseRatio,
        totalStrokeDuration: typeof userOptions.totalStrokeDuration === "undefined" ? 1 : userOptions.totalStrokeDuration,
    };
    validateOptions(options);
    const loader = getLoader(type);
    switch (output) {
        case "svg-css":
            return async (character: string): Promise<SVGElement> => {
                const characterInfo = await loader(character);
                return svgStrokesCss(characterInfo, options);
            };
        case "svg-smil":
        case "svg":
            return async (character: string): Promise<SVGElement> => {
                const characterInfo = await loader(character);
                return svgStrokesSmil(characterInfo, options);
            };
        default:
            throw new Error("Unsupported output!");
    }
};
