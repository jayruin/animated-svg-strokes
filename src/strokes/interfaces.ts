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
    readonly strokes: readonly StrokeInfo[];
    readonly transform: string | null;
    readonly type: string;
    readonly viewBox: string;
}

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Line {
    readonly startPoint: Point;
    readonly endPoint: Point;
    readonly width: number;
}

export interface UserAnimationOptions {
    readonly includeGrid?: boolean;
    readonly pauseRatio?: number;
    readonly totalStrokeDuration?: number;
}

export interface SvgComponents {
    readonly svg: SVGSVGElement;
    readonly group: SVGGElement;
    readonly strokesComponents: readonly SvgStrokeComponents[];
}

export interface SvgStrokeComponents {
    readonly strokePath: SVGPathElement;
    readonly clipPath: SVGClipPathElement | null;
    readonly clipPathPath: SVGPathElement | null;
}

export interface WebAnimationsInfo {
    readonly dashKeyframes: Keyframe[];
    readonly widthKeyframes: Keyframe[];
    readonly keyframeOptions: KeyframeAnimationOptions;
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

export type SvgOutputFormat = "svg-css" | "svg-smil" | "svg-wa" | "svg";

export type StrokesOutputFormat = CanvasOutputFormat | SvgOutputFormat;

export interface CanvasAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): HTMLCanvasElement;
}

export interface SvgAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): SVGSVGElement;
}

export interface StrokesAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): Element;
}

export interface StrokesAnimatorFactory {
    (outputFormat: CanvasOutputFormat): CanvasAnimator;
    (outputFormat: SvgOutputFormat): SvgAnimator;
    (outputFormat: StrokesOutputFormat): StrokesAnimator;
}

export interface CanvasRenderer {
    (character: string): Promise<HTMLCanvasElement>;
}

export interface SvgRenderer {
    (character: string): Promise<SVGElement>;
}

export interface StrokesRenderer {
    (character: string): Promise<Element>;
}

export interface StrokesRendererFactory {
    (type: StrokesType, outputFormat: CanvasOutputFormat, userOptions?: UserAnimationOptions): CanvasRenderer;
    (type: StrokesType, outputFormat: SvgOutputFormat, userOptions?: UserAnimationOptions): SvgRenderer;
    (type: StrokesType, outputFormat: StrokesOutputFormat, userOptions?: UserAnimationOptions): StrokesRenderer;
}
