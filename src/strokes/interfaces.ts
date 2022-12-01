export interface AnimationOptions {
    readonly includeGrid: boolean;
    readonly pauseRatio: number;
    readonly totalStrokeDuration: number;
}

export interface StrokeInfo {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokePathLength: number;
}

export interface CharacterInfo {
    readonly character: string;
    readonly strokeWidth: number;
    readonly strokes: StrokeInfo[];
    readonly transform: string | null;
    readonly type: string;
    readonly viewBox: string;
}

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface UserAnimationOptions {
    readonly includeGrid: boolean | undefined;
    readonly pauseRatio: number | undefined;
    readonly totalStrokeDuration: number | undefined;
}

export interface SVGFactory {
    (char: string): Promise<SVGElement>;
}

export interface Strokes {
    (lang: "ja" | "zh", output: "svg", userOptions: UserAnimationOptions): SVGFactory;
}
