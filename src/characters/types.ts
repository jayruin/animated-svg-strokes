export interface Stroke {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokeWidth: number;
}

export interface Character {
    readonly codePoint: number;
    readonly source: string;
    readonly strokes: readonly Stroke[];
    readonly transform: string | null;
    readonly viewBox: string;
}
