import type { StrokesLoader, StrokesLoaderBuilder, StrokesLoaderFactory, StrokesParser, StrokesRequester, StrokesSource } from "./types";
import { SOURCE_JA, jaParse, jaRequest } from "./ja";
import { SOURCE_ZH, zhParse, zhRequest } from "./zh";

const sources: ReadonlyMap<StrokesSource, Readonly<[StrokesRequester, StrokesParser]>> = new Map<StrokesSource, Readonly<[StrokesRequester, StrokesParser]>>([
    [SOURCE_JA, [jaRequest, jaParse]],
    [SOURCE_ZH, [zhRequest, zhParse]],
]);

export const getSources = (): ReadonlySet<StrokesSource> => Object.freeze(new Set<StrokesSource>(sources.keys()));

export const buildLoader: StrokesLoaderBuilder = (components) => {
    const { source, request, parse, transform } = components;
    const load: StrokesLoader = async (codePoint) => {
        const response = await request(codePoint);
        const character = { codePoint, source, ...await parse(response) };
        return transform(character);
    };
    return load;
};

export const getLoader: StrokesLoaderFactory = (source) => {
    const handlers = sources.get(source);
    if (typeof handlers === "undefined") throw new Error("Unsupported source.");
    const [request, parse] = handlers;
    return buildLoader({ source, request, parse, transform: (character) => character });
};
