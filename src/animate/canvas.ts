import type { CanvasAnimator, CanvasContextAction, CanvasStrokeInfo } from "./types";
import type { StrokeInfo } from "../characters/types";
import type { Line } from "../geometry/types";
import { svgNS } from "../svg/constants";

const convertStrokeInfo = (strokeInfo: StrokeInfo): CanvasStrokeInfo => {
    const { clipPath, strokePath, strokePathLength } = strokeInfo;
    return {
        clipPath: clipPath === null ? null : new Path2D(clipPath),
        strokePath: new Path2D(strokePath),
        strokePathLength,
    };
};

const getContextTransform = (transform: string): CanvasContextAction => {
    const svgElement = document.createElementNS(svgNS, "svg");
    svgElement.setAttributeNS(null, "transform", transform);
    const svgTransform = svgElement.transform.baseVal.consolidate();
    if (svgTransform === null) {
        throw new Error("Could not get svg transform!");
    }
    const { a, b, c, d, e, f } = svgTransform.matrix;
    return (context: CanvasRenderingContext2D): void => {
        context.transform(a, b, c, d, e, f);
    };
};

const drawLine = (context: CanvasRenderingContext2D, line: Line, width: number): void => {
    context.save();
    context.lineWidth = width;
    context.strokeStyle = "#DDD";
    context.beginPath();
    context.moveTo(line.startPoint.x, line.startPoint.y);
    context.lineTo(line.endPoint.x, line.endPoint.y);
    context.stroke();
    context.restore();
};

const drawGrid = (context: CanvasRenderingContext2D): void => {
    const { width, height } = context.canvas;
    drawLine(context, { startPoint: { x: width / 2, y: 0 }, endPoint: { x: width / 2, y: height } }, Math.ceil(width / 100));
    drawLine(context, { startPoint: { x: 0, y: height / 2 }, endPoint: { x: width, y: height / 2 } }, Math.ceil(height / 100));
};

export const animateStrokesCanvas: CanvasAnimator = (characterInfo, options) => {
    const { strokes, transform, viewBox } = characterInfo;
    const { includeGrid, pauseRatio, totalStrokeDuration } = options;
    const canvasStrokeInfos = strokes.map(strokeInfo => convertStrokeInfo(strokeInfo));
    const canvas = document.createElement("canvas");
    const [, , width, height] = viewBox.split(" ").map(value => parseInt(value, 10));
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (context === null) {
        throw new Error("Could not get context from canvas!");
    }
    let previousTimestamp: number | null = null;
    let elapsed = 0;
    let paused = false;
    const totalStrokeDurationMs = totalStrokeDuration * 1000;
    const numberOfStrokes = strokes.length;
    const totalDurationMs = totalStrokeDurationMs * numberOfStrokes;
    const draw = (timestamp: number): void => {
        if (paused) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(draw);
            return;
        }
        if (previousTimestamp === null) {
            previousTimestamp = timestamp;
        }
        elapsed += timestamp - previousTimestamp;
        if (elapsed > totalDurationMs) {
            elapsed = 0;
        }
        context.save();
        if (elapsed === 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (includeGrid) {
                drawGrid(context);
            }
        }
        const strokeIndex = Math.trunc(elapsed / totalStrokeDurationMs);
        const progress = Math.min(1, (elapsed % totalStrokeDurationMs) / totalStrokeDurationMs / (1 - pauseRatio));
        const { clipPath, strokePath, strokePathLength } = canvasStrokeInfos[strokeIndex];
        context.scale(canvas.width / width, canvas.height / height);
        if (transform !== null) {
            const contextTransform = getContextTransform(transform);
            contextTransform(context);
        }
        context.fillStyle = "none";
        context.strokeStyle = "#000";
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = characterInfo.strokeWidth;
        context.setLineDash([strokePathLength * progress, strokePathLength * (1 - progress)]);
        if (clipPath !== null) {
            context.clip(clipPath);
        }
        context.stroke(strokePath);
        context.restore();
        previousTimestamp = timestamp;
        window.requestAnimationFrame(draw);
    };
    window.requestAnimationFrame(draw);
    const reset = (): void => {
        if (!paused) {
            previousTimestamp = null;
            elapsed = 0;
        }
    };
    const togglePause = (): void => {
        paused = !paused;
    };
    document.addEventListener("visibilitychange", reset);
    canvas.addEventListener("click", togglePause);
    return canvas;
};
