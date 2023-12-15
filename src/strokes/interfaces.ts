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

export interface Line {
    readonly endPoint: Point;
    readonly startPoint: Point;
    readonly width: number;
}

export interface UserAnimationOptions {
    readonly includeGrid: boolean | undefined;
    readonly pauseRatio: number | undefined;
    readonly totalStrokeDuration: number | undefined;
}

export interface CanvasStrokeInfo {
    readonly clipPath: Path2D | null;
    readonly strokePath: Path2D;
    readonly strokePathLength: number;
}

export interface CanvasContextAction {
    (context: CanvasRenderingContext2D): void;
}

export interface CharacterLoader {
    (character: string): Promise<CharacterInfo>;
}

export type StrokesType = "ja" | "zh";

export type CanvasOutputFormat = "canvas";

export type SVGOutputFormat = "svg-css" | "svg-smil" | "svg";

export type StrokesOutput = CanvasOutputFormat | SVGOutputFormat;

export interface SVGFactory {
    (character: string): Promise<SVGElement>;
}

export interface CanvasFactory {
    (character: string): Promise<HTMLCanvasElement>;
}

export interface Strokes {
    (type: StrokesType, output: StrokesOutput, userOptions: UserAnimationOptions): StrokesFactory<StrokesOutput>;
}

export type StrokesFactory<T> = T extends SVGOutputFormat ? SVGFactory : T extends CanvasOutputFormat ? CanvasFactory : never;
