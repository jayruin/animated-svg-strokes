import type { FORMAT_CANVAS_2D } from "./canvas-2d";
import type { FORMAT_SVG_CSS } from "./svg-css";
import type { FORMAT_SVG_SMIL } from "./svg-smil";
import type { FORMAT_SVG_WA } from "./svg-wa";
import type { CharacterInfo } from "../characters/types";
import type { Line } from "../geometry/types";

export type CanvasFormat = typeof FORMAT_CANVAS_2D;

export type SvgFormat = typeof FORMAT_SVG_CSS | typeof FORMAT_SVG_SMIL | typeof FORMAT_SVG_WA;

export type StrokesFormat = CanvasFormat | SvgFormat;

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
    (format: CanvasFormat): CanvasAnimator;
    (format: SvgFormat): SvgAnimator;
    (format: StrokesFormat): StrokesAnimator;
}

export interface AnimationOptions {
    readonly includeGrid: boolean;
    readonly gridColor: string;
    readonly gridRows: number;
    readonly gridColumns: number;
    readonly strokeColor: string;
    readonly backgroundColor: string | null;
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

export interface CanvasLineInfo {
    readonly line: Line;
    readonly width: number;
    readonly color: string;
}

export interface CanvasContextAction {
    (context: CanvasRenderingContext2D): void;
}
