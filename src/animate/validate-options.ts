import type { AnimationOptions } from "./types";

const isValidColor = (color: string): boolean => CSS.supports("color", color);

export const validateOptions = (options: AnimationOptions): void => {
    const { gridColor, gridRows, gridColumns, strokeColor, backgroundColor, pauseRatio, totalStrokeDuration } = options;

    if (!isValidColor(gridColor)) throw new RangeError(`${gridColor} is not a valid color!`);

    if (isNaN(gridRows)) throw new RangeError("gridRows is NaN!");
    if (gridRows < 1) throw new RangeError("gridRows cannot be < 1!");

    if (isNaN(gridColumns)) throw new RangeError("gridColumns is NaN!");
    if (gridColumns < 1) throw new RangeError("gridColumns cannot be < 1!");

    if (!isValidColor(strokeColor)) throw new RangeError(`${strokeColor} is not a valid color!`);

    if (backgroundColor !== null && !isValidColor(backgroundColor)) throw new RangeError(`${backgroundColor} is not a valid color!`);

    if (isNaN(pauseRatio)) throw new RangeError("pauseRatio cannot be NaN!");
    if (pauseRatio < 0) throw new RangeError("pauseRatio cannot be < 0!");
    if (pauseRatio >= 1) throw new RangeError("pauseRatio cannot be >= 1!");

    if (isNaN(totalStrokeDuration)) throw new RangeError("totalStrokeDuration cannot be NaN!");
    if (totalStrokeDuration <= 0) throw new RangeError("totalStrokeDuration cannnot be <= 0!");
    if (!isFinite(totalStrokeDuration)) throw new RangeError("totalStrokeDuration must be finite!");
};
