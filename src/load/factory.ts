import type { StrokesLoaderFactory, StrokesSource } from "./types";
import { SOURCE_JA, jaLoad } from "./ja";
import { SOURCE_ZH, zhLoad } from "./zh";

export const getSources = (): ReadonlySet<StrokesSource> => Object.freeze(new Set<StrokesSource>([
    SOURCE_JA,
    SOURCE_ZH,
]));

export const getLoader: StrokesLoaderFactory = (source) => {
    switch (source) {
        case SOURCE_JA:
            return jaLoad;
        case SOURCE_ZH:
            return zhLoad;
        default:
            throw new Error("Unsupported source!");
    }
};
