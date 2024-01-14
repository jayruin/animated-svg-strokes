import type { SOURCE_JA } from "./ja";
import type { SOURCE_ZH } from "./zh";
import type { Character, CharacterSvgData } from "../characters/types";

export type StrokesSource = typeof SOURCE_JA | typeof SOURCE_ZH;

export interface StrokesRequester {
    (codePoint: number): Promise<Response>;
}

export interface StrokesParser {
    (response: Response): Promise<CharacterSvgData>;
}

export interface StrokesTransformer {
    (character: Character): Character;
}

export interface StrokesLoader {
    (codePoint: number): Promise<Character>;
}

export interface StrokesLoaderComponents {
    source: StrokesSource;
    request: StrokesRequester;
    parse: StrokesParser;
    transform: StrokesTransformer;
}

export interface StrokesLoaderBuilder {
    (components: StrokesLoaderComponents): StrokesLoader;
}
