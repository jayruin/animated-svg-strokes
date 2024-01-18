import { getFullOptions } from "./options.js";

import { describe, expect, test } from "vitest";

test("default options are valid", () => {
    const options = getFullOptions();
    expect(Object.keys(options)).toHaveLength(12);
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
