import type { AnimationOptions } from "./types";

export const validateOptions = (options: AnimationOptions): void => {
    const { pauseRatio, totalStrokeDuration } = options;

    if (isNaN(pauseRatio)) {
        throw new RangeError("pauseRatio is NaN!");
    }
    if (pauseRatio < 0) {
        throw new RangeError("pauseRatio cannot be < 0!");
    }
    if (pauseRatio >= 1) {
        throw new RangeError("pauseRatio cannot be >= 1!");
    }

    if (isNaN(totalStrokeDuration)) {
        throw new RangeError("totalStrokeDuration is NaN!");
    }
    if (totalStrokeDuration <= 0) {
        throw new RangeError("totalStrokeDuration cannnot be <= 0!");
    }
    if (!isFinite(totalStrokeDuration)) {
        throw new RangeError("totalStrokeDuration must be finite!");
    }
};
