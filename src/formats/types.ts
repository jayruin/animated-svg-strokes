import type { FORMAT_CANVAS_2D } from "./canvas-2d.js";
import type { FORMAT_SVG_CSS } from "./svg-css.js";
import type { FORMAT_SVG_SMIL } from "./svg-smil.js";
import type { FORMAT_SVG_WA } from "./svg-wa.js";
import type { Character } from "../characters/types.js";
import type { ViewBox } from "../svg/types.js";

export type CanvasFormat = typeof FORMAT_CANVAS_2D;

export type SvgFormat = typeof FORMAT_SVG_CSS | typeof FORMAT_SVG_SMIL | typeof FORMAT_SVG_WA;

export type StrokesFormat = CanvasFormat | SvgFormat;

export interface StrokesAnimator {
    (character: Character, options: StrokesAnimationOptions): StrokesAnimation;
}

export interface StrokesAnimationOptions {
    readonly includeGrid: boolean;
    readonly gridColor: string;
    readonly gridRows: number;
    readonly gridColumns: number;
    readonly includeBackground: boolean;
    readonly backgroundColor: string;
    readonly includePreview: boolean;
    readonly previewColor: string;
    readonly strokeColor: string;
    readonly pauseRatio: number;
    readonly totalStrokeDuration: number;
}

export interface StrokesAnimation {
    readonly element: Element;
    readonly dispose: () => void;
    readonly isPaused: () => boolean;
    readonly pause: () => void;
    readonly resume: () => void;
}

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface Line {
    readonly startPoint: Point;
    readonly endPoint: Point;
}

export interface Canvas2dStrokeInfo {
    readonly clipPath: Path2D | null;
    readonly strokePath: Path2D;
    readonly strokeWidth: number;
    readonly strokePathLength: number;
    readonly strokeColor: string;
    readonly parsedViewBox: ViewBox;
    readonly contextTransform: Canvas2dContextAction | null;
}

export interface Canvas2dLineInfo {
    readonly line: Line;
    readonly width: number;
    readonly color: string;
}

export interface Canvas2dContextAction {
    (context: CanvasRenderingContext2D): void;
}

export interface SvgStrokesComponentsInfo {
    readonly character: Character;
    readonly strokeColor: string;
    readonly uniqueId: string;
    readonly isStatic: boolean;
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
