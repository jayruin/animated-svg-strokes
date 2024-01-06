export interface StrokeInfo {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokePathLength: number;
}

export interface CharacterInfo {
    readonly character: string;
    readonly source: string;
    readonly strokeWidth: number;
    readonly strokes: readonly StrokeInfo[];
    readonly transform: string | null;
    readonly viewBox: string;
}
