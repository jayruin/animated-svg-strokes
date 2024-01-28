import type { Character, CharacterSvgData } from "../characters/types.js";

export interface StrokesConverter {
    (codePoint: number): Promise<number>;
}

export interface StrokesRequester {
    (codePoint: number): Promise<Response>;
}

export interface StrokesParser {
    (response: Response): Promise<CharacterSvgData>;
}

export interface StrokesSourceComponents {
    source: string;
    converter?: StrokesConverter;
    requester: StrokesRequester;
    parser: StrokesParser;
}

export interface StrokesSourceHandler {
    (codePoint: number): Promise<Character>;
}
