import type { Strokes, UserAnimationOptions } from "./interfaces";
import { jaLoad, zhLoad, } from "./loading";
import { validateOptions, } from "./options";
import { svgStrokes, } from "./svg";

export const strokes: Strokes = (lang: string, output: string, userOptions: UserAnimationOptions) => {
    const options = {
        includeGrid: typeof userOptions.includeGrid === "undefined" ? true : userOptions.includeGrid,
        pauseRatio: typeof userOptions.pauseRatio === "undefined" ? 0.2 : userOptions.pauseRatio,
        totalStrokeDuration: typeof userOptions.totalStrokeDuration === "undefined" ? 1 : userOptions.totalStrokeDuration,
    };
    validateOptions(options);
    if (lang === "zh" && output === "svg") {
        return async (char: string): Promise<SVGElement> => {
            const characterInfo = await zhLoad(char);
            return svgStrokes(characterInfo, options);
        };
    }
    if (lang === "ja" && output === "svg") {
        return async (char: string): Promise<SVGElement> => {
            const characterInfo = await jaLoad(char);
            return svgStrokes(characterInfo, options);
        };
    }
    throw new Error("Unsupported lang or output!");
}