import type { StrokesSourceComponents, StrokesSourceHandler } from "./types.js";

const sources: Map<string, StrokesSourceComponents> = new Map<string, StrokesSourceComponents>();

export const getSources = (): ReadonlySet<string> => Object.freeze(new Set<string>(sources.keys()));

export const getSourceComponents = (source: string): StrokesSourceComponents => {
    const components = sources.get(source);
    if (typeof components === "undefined") throw new Error("Unsupported source.");
    return components;
};

export const registerSource = (components: StrokesSourceComponents): void => {
    sources.set(components.source, components);
};

export const getSourceHandler = (source: string): StrokesSourceHandler => {
    const { converter, requester, parser } = getSourceComponents(source);
    const sourceHandler: StrokesSourceHandler = async (codePoint) => {
        const convertedCodePoint = typeof converter === "function" ? await converter(codePoint) : codePoint;
        const response = await requester(convertedCodePoint);
        const character = { ...await parser(response), codePoint: convertedCodePoint, source };
        return character;
    };
    return sourceHandler;
};
