import type { AnimationOptions, CanvasAnimator, CanvasContextAction, CanvasLineInfo, CanvasStrokeInfo } from "./types";
import type { StrokeInfo } from "../characters/types";
import { svgNS } from "../svg/constants";
import { parseViewBox } from "../svg/view-box";

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

const drawLine = (context: CanvasRenderingContext2D, lineInfo: CanvasLineInfo): void => {
    context.save();
    context.lineWidth = lineInfo.width;
    context.strokeStyle = lineInfo.color;
    context.beginPath();
    context.moveTo(lineInfo.line.startPoint.x, lineInfo.line.startPoint.y);
    context.lineTo(lineInfo.line.endPoint.x, lineInfo.line.endPoint.y);
    context.stroke();
    context.restore();
};

const drawGrid = (context: CanvasRenderingContext2D, options: AnimationOptions): void => {
    if (!options.includeGrid) {
        return;
    }
    const { width, height } = context.canvas;
    for (let xCount = 1; xCount < options.gridColumns; xCount += 1) {
        const x = width * (xCount / options.gridColumns);
        drawLine(context, {
            line: { startPoint: { x, y: 0 }, endPoint: { x, y: height } },
            width: Math.ceil(width / 100),
            color: options.gridColor,
        });
    }
    for (let yCount = 1; yCount < options.gridRows; yCount += 1) {
        const y = height * (yCount / options.gridRows);
        drawLine(context, {
            line: { startPoint: { x: 0, y }, endPoint: { x: width, y } },
            width: Math.ceil(height / 100),
            color: options.gridColor,
        });
    }
};

const resetCanvas = (context: CanvasRenderingContext2D, options: AnimationOptions): void => {
    const { backgroundColor } = options;
    context.save();
    if (backgroundColor === null) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    } else {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    context.restore();
    drawGrid(context, options);
};

export const FORMAT_CANVAS_2D = "canvas-2d";

export const animateStrokesCanvas2d: CanvasAnimator = (characterInfo, options) => {
    const { strokeWidth, strokes, transform, viewBox } = characterInfo;
    const { strokeColor, pauseRatio, totalStrokeDuration } = options;
    const canvasStrokeInfos = strokes.map((strokeInfo) => convertStrokeInfo(strokeInfo));
    const canvas = document.createElement("canvas");
    const { width, height } = parseViewBox(viewBox);
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
        if (elapsed === 0) {
            resetCanvas(context, options);
        }
        context.save();
        const strokeIndex = Math.trunc(elapsed / totalStrokeDurationMs);
        const progress = Math.min(1, (elapsed % totalStrokeDurationMs) / totalStrokeDurationMs / (1 - pauseRatio));
        const { clipPath, strokePath, strokePathLength } = canvasStrokeInfos[strokeIndex];
        context.scale(canvas.width / width, canvas.height / height);
        if (transform !== null) {
            const contextTransform = getContextTransform(transform);
            contextTransform(context);
        }
        context.fillStyle = "none";
        context.strokeStyle = strokeColor;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = strokeWidth;
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
    document.addEventListener("visibilitychange", reset);
    if (options.interactive) {
        const togglePause = (): void => {
            paused = !paused;
        };
        canvas.addEventListener("click", togglePause);
    }
    return canvas;
};
