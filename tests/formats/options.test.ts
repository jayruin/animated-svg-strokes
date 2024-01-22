import { getFullOptions } from "./options.js";

import { describe, expect, test } from "vitest";

test("default options are valid", () => {
    const options = getFullOptions();
    expect(Object.keys(options)).toHaveLength(11);
});

test("getFullOptions returns frozen options", () => {
    const options = getFullOptions();
    expect(Object.isFrozen(options)).toBe(true);
});

test("getFullOptions ignores explicit undefined properties", () => {
    const options = getFullOptions({ strokeColor: undefined });
    expect(options.strokeColor).toBeTypeOf("string");
});

test("getFullOptions ignores extra properties", () => {
    const options: any = getFullOptions({ dummy: true } as any);
    expect(options.dummy).toBeUndefined();
});

describe.each([
    "#000000",
    "black",
    "rgb(0, 0, 0)",
])("%s is a valid color", (color) => {
    test(`gridColor = ${color} is valid`, () => {
        const options = getFullOptions({ gridColor: color });
        expect(options.gridColor).toBe(color);
    });

    test(`backgroundColor = ${color} is valid`, () => {
        const options = getFullOptions({ backgroundColor: color });
        expect(options.backgroundColor).toBe(color);
    });

    test(`previewColor = ${color} is valid`, () => {
        const options = getFullOptions({ previewColor: color });
        expect(options.previewColor).toBe(color);
    });

    test(`strokeColor = ${color} is valid`, () => {
        const options = getFullOptions({ strokeColor: color });
        expect(options.strokeColor).toBe(color);
    });
});

describe.each([
    "",
    "not-a-color",
    "currentcolor",
    "CURRENTCOLOR",
    "inherit",
    "initial",
    "revert",
    "revert-layer",
    "unset",
])("%s is not a valid color", (color) => {
    test(`gridColor = ${color} is invalid`, () => {
        expect(() => getFullOptions({ gridColor: color })).toThrowError("gridColor");
    });

    test(`backgroundColor = ${color} is invalid`, () => {
        expect(() => getFullOptions({ backgroundColor: color })).toThrowError("backgroundColor");
    });

    test(`previewColor = ${color} is invalid`, () => {
        expect(() => getFullOptions({ previewColor: color })).toThrowError("previewColor");
    });

    test(`strokeColor = ${color} is invalid`, () => {
        expect(() => getFullOptions({ strokeColor: color })).toThrowError("strokeColor");
    });
});

describe.each([
    1,
    2,
    5,
])("%s is a valid grid size", (size) => {
    test(`gridRows = ${size} is valid`, () => {
        const options = getFullOptions({ gridRows: size });
        expect(options.gridRows).toBe(size);
    });

    test(`gridColumns = ${size} is valid`, () => {
        const options = getFullOptions({ gridColumns: size });
        expect(options.gridColumns).toBe(size);
    });
});

describe.each([
    NaN,
    Infinity,
    -1,
    0,
    0.5,
])("%s is not a valid grid size", (size) => {
    test(`gridRows = ${size} is invalid`, () => {
        expect(() => getFullOptions({ gridRows: size })).toThrowError("gridRows");
    });

    test(`gridColumns = ${size} is invalid`, () => {
        expect(() => getFullOptions({ gridColumns: size })).toThrowError("gridColumns");
    });
});

test.each([
    0,
    0.5,
    0.99,
])("pauseRatio = %s is valid", (pauseRatio) => {
    const options = getFullOptions({ pauseRatio });
    expect(options.pauseRatio).toBe(pauseRatio);
});

test.each([
    NaN,
    Infinity,
    -1,
    1,
    100,
])("pauseRatio = %s is invalid", (pauseRatio) => {
    expect(() => getFullOptions({ pauseRatio })).toThrowError("pauseRatio");
});

test.each([
    0.5,
    1,
    10,
])("totalStrokeDuration = %s is valid", (totalStrokeDuration) => {
    const options = getFullOptions({ totalStrokeDuration });
    expect(options.totalStrokeDuration).toBe(totalStrokeDuration);
});

test.each([
    NaN,
    Infinity,
    -1,
    0,
])("totalStrokeDuration = %s is invalid", (totalStrokeDuration) => {
    expect(() => getFullOptions({ totalStrokeDuration })).toThrowError("totalStrokeDuration");
});
