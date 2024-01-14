export interface Stroke {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokeWidth: number;
}

export interface CharacterIdentifiers {
    readonly codePoint: number;
    readonly source: string;
}

export interface CharacterSvgData {
    readonly strokes: readonly Stroke[];
    readonly transform: string | null;
    readonly viewBox: string;
}

export interface Character extends CharacterIdentifiers, CharacterSvgData {}
