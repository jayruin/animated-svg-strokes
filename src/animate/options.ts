import type { AnimationOptions } from "./types";

const isValidColor = (color: string): boolean => CSS.supports("color", color);
const isString = (s: unknown): s is string => typeof s === "string";
const isNumber = (n: unknown): n is number => typeof n === "number";

const validateGridColor = (gridColor: string, errors: Error[]): void => {
    if (!isString(gridColor)) errors.push(new TypeError("gridColor is not a string."));
    if (!isValidColor(gridColor)) errors.push(new RangeError("gridColor is not a valid color."));
};
const validateGridRows = (gridRows: number, errors: Error[]): void => {
    if (!isNumber(gridRows)) errors.push(new TypeError("gridRows is not a number."));
    if (isNaN(gridRows)) errors.push(new RangeError("gridRows is NaN."));
    if (gridRows < 1) errors.push(new RangeError("gridRows cannot be < 1."));
    if (!isFinite(gridRows)) errors.push(new RangeError("gridRows must be finite."));
};
const validateGridColumns = (gridColumns: number, errors: Error[]): void => {
    if (!isNumber(gridColumns)) errors.push(new TypeError("gridColumns is not a number."));
    if (isNaN(gridColumns)) errors.push(new RangeError("gridColumns is NaN."));
    if (gridColumns < 1) errors.push(new RangeError("gridColumns cannot be < 1."));
    if (!isFinite(gridColumns)) errors.push(new RangeError("gridColumns must be finite."));
};
const validateStrokeColor = (strokeColor: string, errors: Error[]): void => {
    if (!isString(strokeColor)) errors.push(new TypeError("strokeColor is not a string."));
    if (!isValidColor(strokeColor)) errors.push(new RangeError("strokeColor is not a valid color."));
};
const validateBackgroundColor = (backgroundColor: string | null, errors: Error[]): void => {
    if (backgroundColor !== null) {
        if (!isString(backgroundColor)) errors.push(new TypeError("backgroundColor is not a string."));
        if (!isValidColor(backgroundColor)) errors.push(new RangeError("backgroundColor is not a valid color."));
    }
};
const validatePauseRatio = (pauseRatio: number, errors: Error[]): void => {
    if (!isNumber(pauseRatio)) errors.push(new TypeError("pauseRatio is not a number."));
    if (isNaN(pauseRatio)) errors.push(new RangeError("pauseRatio cannot be NaN."));
    if (pauseRatio < 0) errors.push(new RangeError("pauseRatio cannot be < 0."));
    if (pauseRatio >= 1) errors.push(new RangeError("pauseRatio cannot be >= 1."));
};
const validateTotalStrokeDuration = (totalStrokeDuration: number, errors: Error[]): void => {
    if (!isNumber(totalStrokeDuration)) errors.push(new TypeError("totalStrokeDuration is not a number."));
    if (isNaN(totalStrokeDuration)) errors.push(new RangeError("totalStrokeDuration cannot be NaN."));
    if (totalStrokeDuration <= 0) errors.push(new RangeError("totalStrokeDuration cannnot be <= 0."));
    if (!isFinite(totalStrokeDuration)) errors.push(new RangeError("totalStrokeDuration must be finite."));
};

const validateOptions = (options: AnimationOptions): void => {
    const { gridColor, gridRows, gridColumns, strokeColor, backgroundColor, pauseRatio, totalStrokeDuration } = options;

    const errors: Error[] = [];

    validateGridColor(gridColor, errors);
    validateGridRows(gridRows, errors);
    validateGridColumns(gridColumns, errors);
    validateStrokeColor(strokeColor, errors);
    validateBackgroundColor(backgroundColor, errors);
    validatePauseRatio(pauseRatio, errors);
    validateTotalStrokeDuration(totalStrokeDuration, errors);

    if (errors.length > 0) throw new AggregateError(errors);
};

const defaultOptions: AnimationOptions = Object.freeze({
    includeGrid: false,
    gridColor: "#c0c0c0",
    gridRows: 2,
    gridColumns: 2,
    strokeColor: "#000000",
    includeBackground: false,
    backgroundColor: "#ffffff",
    pauseRatio: 0.2,
    totalStrokeDuration: 1,
    interactive: true,
});

export const getFullOptions = (partialOptions?: Partial<AnimationOptions>): AnimationOptions => {
    const options = { ...defaultOptions, ...partialOptions };
    validateOptions(options);
    return options;
};
