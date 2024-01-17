import type { StrokesLoader, StrokesLoaderComponents, StrokesParser, StrokesRequester, StrokesSource } from "./types.js";
import { SOURCE_JA, jaParse, jaRequest } from "./ja.js";
import { SOURCE_ZH, zhParse, zhRequest } from "./zh.js";

const sources: ReadonlyMap<StrokesSource, Readonly<[StrokesRequester, StrokesParser]>> = new Map<StrokesSource, Readonly<[StrokesRequester, StrokesParser]>>([
    [SOURCE_JA, [jaRequest, jaParse]],
    [SOURCE_ZH, [zhRequest, zhParse]],
]);

const getHandlers = (source: StrokesSource): Readonly<[StrokesRequester, StrokesParser]> => {
    const handlers = sources.get(source);
    if (typeof handlers === "undefined") throw new Error("Unsupported source.");
    return handlers;
};

export const getSources = (): ReadonlySet<StrokesSource> => Object.freeze(new Set<StrokesSource>(sources.keys()));

export const getRequester = (source: StrokesSource): StrokesRequester => {
    const handlers = getHandlers(source);
    return handlers[0];
};

export const getParser = (source: StrokesSource): StrokesParser => {
    const handlers = getHandlers(source);
    return handlers[1];
};

export const buildLoader = (components: StrokesLoaderComponents): StrokesLoader => {
    const { source, convert, request, parse } = components;
    const load: StrokesLoader = async (codePoint) => {
        const convertedCodePoint = typeof convert === "function" ? await convert(codePoint) : codePoint;
        const response = await request(convertedCodePoint);
        const character = { codePoint: convertedCodePoint, source, ...await parse(response) };
        return character;
    };
    return load;
};

export const getLoader = (source: StrokesSource): StrokesLoader => {
    const handlers = getHandlers(source);
    const [request, parse] = handlers;
    return buildLoader({ source, request, parse });
};
