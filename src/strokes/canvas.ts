import type { AnimationOptions, CanvasContextAction, CanvasStrokeInfo, CharacterInfo, Line, StrokeInfo } from "./interfaces";
import { svgNS } from "./svg";

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

const drawLine = (context: CanvasRenderingContext2D, line: Line): void => {
    context.save();
    context.lineWidth = line.width;
    context.strokeStyle = "#DDD";
    context.beginPath();
    context.moveTo(line.startPoint.x, line.startPoint.y);
    context.lineTo(line.endPoint.x, line.endPoint.y);
    context.stroke();
    context.restore();
};

const drawGrid = (context: CanvasRenderingContext2D): void => {
    const { width, height } = context.canvas;
    drawLine(context, { endPoint: { x: width / 2, y: height }, startPoint: { x: width / 2, y: 0 }, width: Math.ceil(width / 100) });
    drawLine(context, { endPoint: { x: width, y: height / 2 }, startPoint: { x: 0, y: height / 2 }, width: Math.ceil(height / 100) });
};

export const canvasStrokes = (characterInfo: CharacterInfo, options: AnimationOptions): HTMLCanvasElement => {
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
    let start: number | null = null;
    const totalStrokeDurationMs = totalStrokeDuration * 1000;
    const numberOfStrokes = strokes.length;
    const totalDurationMs = totalStrokeDurationMs * numberOfStrokes;
    const draw = (timestamp: number): void => {
        context.save();
        const isCanvasEmpty = !context.getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0);
        if (isCanvasEmpty) {
            start = null;
        }
        if (start === null || timestamp - start > totalDurationMs) {
            start = timestamp;
        }
        const elapsed = timestamp - start;
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
        window.requestAnimationFrame(draw);
    };
    window.requestAnimationFrame(draw);
    const reset = (): void => {
        start = null;
    };
    document.addEventListener("visibilitychange", reset);
    return canvas;
};
