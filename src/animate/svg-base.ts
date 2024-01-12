import type { AnimationOptions, SvgComponents, SvgStrokeComponents } from "./types";
import type { Character } from "../characters/types";
import type { Line } from "../geometry/types";
import type { ViewBox } from "../svg/types";
import { svgNS } from "../svg/constants";
import { parseViewBox } from "../svg/view-box";

const fillBackground = (svg: SVGSVGElement, options: AnimationOptions, viewBox: ViewBox): void => {
    const { includeBackground, backgroundColor } = options;
    if (!includeBackground) {
        return;
    }
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttributeNS(null, "width", viewBox.width.toString());
    rect.setAttributeNS(null, "height", viewBox.height.toString());
    rect.setAttributeNS(null, "fill", backgroundColor);
    svg.append(rect);
};

const createSvgLine = (line: Line, stroke: string): SVGLineElement => {
    const svgLine = document.createElementNS(svgNS, "line");
    svgLine.setAttributeNS(null, "x1", line.startPoint.x.toString());
    svgLine.setAttributeNS(null, "y1", line.startPoint.y.toString());
    svgLine.setAttributeNS(null, "x2", line.endPoint.x.toString());
    svgLine.setAttributeNS(null, "y2", line.endPoint.y.toString());
    svgLine.setAttributeNS(null, "stroke", stroke);
    svgLine.setAttributeNS(null, "stroke-width", "1%");
    return svgLine;
};

const drawGrid = (svg: SVGSVGElement, options: AnimationOptions, viewBox: ViewBox): void => {
    if (!options.includeGrid) {
        return;
    }
    const { width, height } = viewBox;
    for (let xCount = 1; xCount < options.gridColumns; xCount += 1) {
        const x = width * (xCount / options.gridColumns);
        const line = {
            startPoint: { x, y: 0 },
            endPoint: { x, y: height },
        };
        svg.append(createSvgLine(line, options.gridColor));
    }
    for (let yCount = 1; yCount < options.gridRows; yCount += 1) {
        const y = height * (yCount / options.gridRows);
        const line = {
            startPoint: { x: 0, y },
            endPoint: { x: width, y },
        };
        svg.append(createSvgLine(line, options.gridColor));
    }
};

export const animateStrokesSvgBase = (character: Character, options: AnimationOptions): SvgComponents => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", character.viewBox);

    const viewBox = parseViewBox(character.viewBox);

    fillBackground(svg, options, viewBox);

    drawGrid(svg, options, viewBox);

    const group = document.createElementNS(svgNS, "g");
    if (character.transform !== null) {
        group.setAttributeNS(null, "transform", character.transform);
    }
    svg.append(group);

    const strokesComponents: SvgStrokeComponents[] = [];

    for (let strokeNumber = 0; strokeNumber < character.strokes.length; strokeNumber += 1) {
        const stroke = character.strokes[strokeNumber];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", stroke.strokePath);

        let clipPathElement = null;
        let clipPathPathElement = null;
        if (stroke.clipPath !== null) {
            const clipPathId = `clipPath-${character.codePoint}-${character.source}-${strokeNumber}`;
            clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            group.append(clipPathElement);
            strokePath.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);

            clipPathPathElement = document.createElementNS(svgNS, "path");
            clipPathPathElement.setAttributeNS(null, "d", stroke.clipPath);
            clipPathElement.append(clipPathPathElement);
        }

        strokePath.setAttributeNS(null, "fill", "none");
        strokePath.setAttributeNS(null, "stroke", options.strokeColor);
        strokePath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");

        group.append(strokePath);

        strokesComponents.push({ clipPath: clipPathElement, clipPathPath: clipPathPathElement, strokePath });
    }

    return { svg, group, strokesComponents };
};
