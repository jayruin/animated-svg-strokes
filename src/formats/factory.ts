import type { StrokesFormatComponents, StrokesFormatHandler } from "./types.js";

const formats: Map<string, StrokesFormatComponents> = new Map<string, StrokesFormatComponents>();

export const getFormats = (): ReadonlySet<string> => Object.freeze(new Set<string>(formats.keys()));

export const getFormatComponents = (format: string): StrokesFormatComponents => {
    const components = formats.get(format);
    if (typeof components === "undefined") throw new Error("Unsupported format.");
    return components;
};

export const registerFormat = (components: StrokesFormatComponents): void => {
    formats.set(components.format, components);
};

export const getFormatHandler = (format: string): StrokesFormatHandler => {
    const { animator } = getFormatComponents(format);
    const formatHandler: StrokesFormatHandler = (character, options) => {
        const { codePoint, source, strokes, transform, viewBox } = character;
        return { ...animator({ strokes, transform, viewBox }, options), codePoint, source, format };
    };
    return formatHandler;
};
