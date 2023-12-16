import { canvasStrokes } from "./canvas";
import type { CharacterLoader, Strokes, StrokesOutput, StrokesType, UserAnimationOptions } from "./interfaces";
import { jaLoad, zhLoad } from "./loading";
import { validateOptions } from "./options";
import { svgStrokesCss } from "./svg-css";
import { svgStrokesSmil } from "./svg-smil";

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

const validateCharacter = (character: string): void => {
    if (character.length !== 1) {
        throw new Error("Must be a single character!");
    }
};

export const strokes: Strokes = (type: StrokesType, output: StrokesOutput, userOptions: UserAnimationOptions) => {
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
                validateCharacter(character);
                const characterInfo = await loader(character);
                return svgStrokesCss(characterInfo, options);
            };
        case "svg-smil":
        case "svg":
            return async (character: string): Promise<SVGElement> => {
                validateCharacter(character);
                const characterInfo = await loader(character);
                return svgStrokesSmil(characterInfo, options);
            };
        case "canvas":
            return async (character: string): Promise<HTMLCanvasElement> => {
                validateCharacter(character);
                const characterInfo = await loader(character);
                return canvasStrokes(characterInfo, options);
            };
        default:
            throw new Error("Unsupported output!");
    }
};
