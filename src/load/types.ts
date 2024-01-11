import type { Character } from "../characters/types";
import type { SOURCE_JA } from "./ja";
import type { SOURCE_ZH } from "./zh";

export type StrokesSource = typeof SOURCE_JA | typeof SOURCE_ZH;

export interface CharacterLoader {
    (codePoint: number): Promise<Character>;
}

export interface StrokesLoaderFactory {
    (source: StrokesSource): CharacterLoader;
}
