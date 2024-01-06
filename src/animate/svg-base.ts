import type { AnimationOptions, SvgComponents, SvgStrokeComponents } from "./types";
import type { CharacterInfo } from "../characters/types";
import type { Line } from "../geometry/types";
import type { ViewBox } from "../svg/types";
import { svgNS } from "../svg/constants";
import { parseViewBox } from "../svg/view-box";

const fillBackground = (svg: SVGSVGElement, options: AnimationOptions, viewBox: ViewBox): void => {
    const { backgroundColor } = options;
    if (backgroundColor === null) {
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

export const animateStrokesSvgBase = (characterInfo: CharacterInfo, options: AnimationOptions): SvgComponents => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", characterInfo.viewBox);

    const viewBox = parseViewBox(characterInfo.viewBox);

    fillBackground(svg, options, viewBox);

    drawGrid(svg, options, viewBox);

    const group = document.createElementNS(svgNS, "g");
    if (characterInfo.transform !== null) {
        group.setAttributeNS(null, "transform", characterInfo.transform);
    }
    svg.append(group);

    const strokesComponents: SvgStrokeComponents[] = [];

    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeInfo = characterInfo.strokes[strokeNumber];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", strokeInfo.strokePath);

        let clipPathElement = null;
        let clipPathPathElement = null;
        if (strokeInfo.clipPath !== null) {
            const clipPathId = `${characterInfo.character}-${characterInfo.source}-clipPath-${strokeNumber}`;
            clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            group.append(clipPathElement);
            strokePath.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);

            clipPathPathElement = document.createElementNS(svgNS, "path");
            clipPathPathElement.setAttributeNS(null, "d", strokeInfo.clipPath);
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
