import type { AnimationOptions } from "./types";

const isValidColor = (color: string): boolean => CSS.supports("color", color);
const isString = (s: unknown): s is string => typeof s === "string";
const isNumber = (n: unknown): n is number => typeof n === "number";
const isBoolean = (b: unknown): b is boolean => typeof b === "boolean";

const validateBoolean = function* (value: boolean, name: string): Iterable<Error> {
    if (!isBoolean(value)) yield new TypeError(`${name} is not a boolean.`);
};

const validateColor = function* (value: string, name: string): Iterable<Error> {
    if (!isString(value)) yield new TypeError(`${name} is not a string.`);
    if (!isValidColor(value)) yield new RangeError(`${name} is not a valid color.`);
};

interface NumberRange {
    readonly gt?: number;
    readonly lt?: number;
    readonly ge?: number;
    readonly le?: number;
}
const validateNumber = function* (value: number, name: string, range?: NumberRange): Iterable<Error> {
    if (!isNumber(value)) yield new TypeError(`${name} is not a number.`);
    if (isNaN(value)) yield new RangeError(`${name} is NaN.`);
    if (!isFinite(value)) yield new RangeError(`${name} is not finite.`);
    if (isNumber(range?.gt) && !(value > range.gt)) yield new RangeError(`${name} is not > ${range.gt}.`);
    if (isNumber(range?.lt) && !(value < range.lt)) yield new RangeError(`${name} is not < ${range.lt}.`);
    if (isNumber(range?.ge) && !(value >= range.ge)) yield new RangeError(`${name} is not >= ${range.ge}.`);
    if (isNumber(range?.le) && !(value <= range.le)) yield new RangeError(`${name} is not <= ${range.le}.`);
};

const validateOptions = (options: AnimationOptions): void => {
    const {
        includeGrid, gridColor, gridRows, gridColumns,
        includeBackground, backgroundColor,
        includePreview, previewColor,
        strokeColor, pauseRatio, totalStrokeDuration, interactive,
    } = options;

    const errors: Error[] = [
        ...validateBoolean(includeGrid, "includeGrid"),
        ...validateColor(gridColor, "gridColor"),
        ...validateNumber(gridRows, "gridRows", { ge: 1 }),
        ...validateNumber(gridColumns, "gridColumns", { ge: 1 }),

        ...validateBoolean(includeBackground, "includeBackground"),
        ...validateColor(backgroundColor, "backgroundColor"),

        ...validateBoolean(includePreview, "includePreview"),
        ...validateColor(previewColor, "previewColor"),

        ...validateColor(strokeColor, "strokeColor"),
        ...validateNumber(pauseRatio, "pauseRatio", { ge: 0, lt: 1 }),
        ...validateNumber(totalStrokeDuration, "totalStrokeDuration", { gt: 0 }),
        ...validateBoolean(interactive, "interactive"),
    ];

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
