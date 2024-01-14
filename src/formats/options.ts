import type { AnimationOptions } from "./types";

const isValidColor = (color: string): boolean => CSS.supports("color", color);
const isString = (s: unknown): s is string => typeof s === "string";
const isNumber = (n: unknown): n is number => typeof n === "number";
const isBoolean = (b: unknown): b is boolean => typeof b === "boolean";

const validateBoolean = (option: boolean, optionName: string, errors: Error[]): void => {
    if (!isBoolean(option)) errors.push(new TypeError(`${optionName} is not a boolean.`));
};
const validateColor = (option: string, optionName: string, errors: Error[]): void => {
    if (!isString(option)) errors.push(new TypeError(`${optionName} is not a string.`));
    if (!isValidColor(option)) errors.push(new RangeError(`${optionName} is not a valid color.`));
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
    const {
        includeGrid, gridColor, gridRows, gridColumns,
        includeBackground, backgroundColor,
        includePreview, previewColor,
        strokeColor, pauseRatio, totalStrokeDuration, interactive,
    } = options;

    const errors: Error[] = [];

    validateBoolean(includeGrid, "includeGrid", errors);
    validateColor(gridColor, "gridColor", errors);
    validateGridRows(gridRows, errors);
    validateGridColumns(gridColumns, errors);

    validateBoolean(includeBackground, "includeBackground", errors);
    validateColor(backgroundColor, "backgroundColor", errors);

    validateBoolean(includePreview, "includePreview", errors);
    validateColor(previewColor, "previewColor", errors);

    validateColor(strokeColor, "strokeColor", errors);
    validatePauseRatio(pauseRatio, errors);
    validateTotalStrokeDuration(totalStrokeDuration, errors);
    validateBoolean(interactive, "interactive", errors);

    if (errors.length > 0) throw new AggregateError(errors);
};

const defaultOptions: AnimationOptions = Object.freeze({
    includeGrid: false,
    gridColor: "#d3d3d3",
    gridRows: 2,
    gridColumns: 2,
    includeBackground: false,
    backgroundColor: "#ffffff",
    includePreview: false,
    previewColor: "#c0c0c0",
    strokeColor: "#000000",
    pauseRatio: 0.2,
    totalStrokeDuration: 1,
    interactive: true,
});

export const getFullOptions = (partialOptions?: Partial<AnimationOptions>): AnimationOptions => {
    const options = {
        ...defaultOptions,
        ...Object.fromEntries(
            Object.entries(partialOptions ?? {})
                .filter(([k, v]: [string, unknown]) => k in defaultOptions && typeof v !== "undefined" && v !== null)
        ),
    };
    validateOptions(options);
    return Object.freeze(options);
};
