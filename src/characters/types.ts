export interface StrokeInfo {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokePathLength: number;
}

export interface CharacterInfo {
    readonly character: string;
    readonly strokeWidth: number;
    readonly strokes: readonly StrokeInfo[];
    readonly transform: string | null;
    readonly type: string;
    readonly viewBox: string;
}
