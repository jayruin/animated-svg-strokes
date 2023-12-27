import type { CharacterInfo } from "../characters/types";

export interface CanvasAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): HTMLCanvasElement;
}

export interface SvgAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): SVGSVGElement;
}

export interface StrokesAnimator {
    (characterInfo: CharacterInfo, options: AnimationOptions): Element;
}

export interface AnimationOptions {
    readonly includeGrid: boolean;
    readonly gridColor: string;
    readonly gridRows: number;
    readonly gridColumns: number;
    readonly pauseRatio: number;
    readonly totalStrokeDuration: number;
    readonly interactive: boolean;
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
