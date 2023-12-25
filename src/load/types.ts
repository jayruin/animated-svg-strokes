import type { CharacterInfo } from "../characters/types";

export interface CharacterLoader {
    (character: string): Promise<CharacterInfo>;
}
