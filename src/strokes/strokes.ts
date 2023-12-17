import { animateStrokesCanvas } from "./canvas";
import type { CharacterLoader, StrokesAnimatorFactory, StrokesOutputFormat, StrokesRendererFactory, StrokesType, UserAnimationOptions } from "./interfaces";
import { zhLoad } from "./loading-zh";
import { jaLoad } from "./loading-ja";
import { validateOptions } from "./options";
import { animateStrokesSvgCss } from "./svg-css";
import { animateStrokesSvgSmil } from "./svg-smil";
import { animateStrokesSvgWa } from "./svg-wa";

const validateCharacter = (character: string): void => {
    if (character.length !== 1) {
        throw new Error("Must be a single character!");
    }
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
    const options = {
        includeGrid: typeof userOptions?.includeGrid === "undefined" ? true : userOptions.includeGrid,
        pauseRatio: typeof userOptions?.pauseRatio === "undefined" ? 0.2 : userOptions.pauseRatio,
        totalStrokeDuration: typeof userOptions?.totalStrokeDuration === "undefined" ? 1 : userOptions.totalStrokeDuration,
    };
    validateOptions(options);
    const loader = getLoader(type);
    const animator = getAnimator(outputFormat);
    const renderer = async (character: string): Promise<Element> => {
        validateCharacter(character);
        const characterInfo = await loader(character);
        return animator(characterInfo, options);
    };
    return renderer;
};
