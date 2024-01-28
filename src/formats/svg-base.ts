import type { Line, StrokesAnimationOptions, SvgComponents, SvgStrokeComponents, SvgStrokesComponentsInfo } from "./types.js";
import type { CharacterSvgData } from "../characters/types.js";
import type { ViewBox } from "../svg/types.js";
import { svgNS } from "../svg/constants.js";
import { parseViewBox } from "../svg/view-box.js";

const createBackground = (options: StrokesAnimationOptions, viewBox: ViewBox): SVGGElement | null => {
    const { includeBackground, backgroundColor } = options;
    if (!includeBackground) {
        return null;
    }
    const group = document.createElementNS(svgNS, "g");
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttributeNS(null, "width", viewBox.width.toString());
    rect.setAttributeNS(null, "height", viewBox.height.toString());
    rect.setAttributeNS(null, "fill", backgroundColor);
    group.append(rect);
    return group;
};

const createSvgLine = (line: Line, color: string): SVGLineElement => {
    const svgLine = document.createElementNS(svgNS, "line");
    svgLine.setAttributeNS(null, "x1", line.startPoint.x.toString());
    svgLine.setAttributeNS(null, "y1", line.startPoint.y.toString());
    svgLine.setAttributeNS(null, "x2", line.endPoint.x.toString());
    svgLine.setAttributeNS(null, "y2", line.endPoint.y.toString());
    svgLine.setAttributeNS(null, "stroke", color);
    svgLine.setAttributeNS(null, "stroke-width", "1%");
    return svgLine;
};

const createGrid = (options: StrokesAnimationOptions, viewBox: ViewBox): SVGGElement | null => {
    if (!options.includeGrid) {
        return null;
    }
    const group = document.createElementNS(svgNS, "g");
    const { width, height } = viewBox;
    for (let xCount = 1; xCount < options.gridColumns; xCount += 1) {
        const x = width * (xCount / options.gridColumns);
        const line = {
            startPoint: { x, y: 0 },
            endPoint: { x, y: height },
        };
        group.append(createSvgLine(line, options.gridColor));
    }
    for (let yCount = 1; yCount < options.gridRows; yCount += 1) {
        const y = height * (yCount / options.gridRows);
        const line = {
            startPoint: { x: 0, y },
            endPoint: { x: width, y },
        };
        group.append(createSvgLine(line, options.gridColor));
    }
    return group;
};

const getStrokesComponents = (strokesComponentsInfo: SvgStrokesComponentsInfo): SvgStrokeComponents[] => {
    const { character, strokeColor, uniqueId, isStatic } = strokesComponentsInfo;
    const strokesComponents: SvgStrokeComponents[] = [];
    for (let strokeNumber = 0; strokeNumber < character.strokes.length; strokeNumber += 1) {
        const stroke = character.strokes[strokeNumber];

        const strokePathElement = document.createElementNS(svgNS, "path");
        strokePathElement.setAttributeNS(null, "d", stroke.strokePath);

        let clipPathElement = null;
        let clipPathPathElement = null;
        if (stroke.clipPath !== null) {
            const clipPathId = [
                "clipPath",
                ...isStatic ? ["static"] : [],
                strokeNumber.toString(),
                uniqueId,
            ].join("-");
            clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            strokePathElement.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);

            clipPathPathElement = document.createElementNS(svgNS, "path");
            clipPathPathElement.setAttributeNS(null, "d", stroke.clipPath);
            clipPathElement.append(clipPathPathElement);
        }

        strokePathElement.setAttributeNS(null, "fill", "none");
        strokePathElement.setAttributeNS(null, "stroke", strokeColor);
        strokePathElement.setAttributeNS(null, "stroke-linecap", "round");
        strokePathElement.setAttributeNS(null, "stroke-linejoin", "round");
        if (isStatic) {
            strokePathElement.setAttributeNS(null, "stroke-width", stroke.strokeWidth.toString());
        }

        strokesComponents.push({ clipPath: clipPathElement, clipPathPath: clipPathPathElement, strokePath: strokePathElement });
    }
    return strokesComponents;
};

const createPreview = (character: CharacterSvgData, options: StrokesAnimationOptions, uniqueId: string): SVGGElement | null => {
    if (!options.includePreview) {
        return null;
    }
    const group = document.createElementNS(svgNS, "g");
    const strokesComponents = getStrokesComponents({ character, strokeColor: options.previewColor, uniqueId, isStatic: true });
    strokesComponents.forEach(({ clipPath, strokePath }) => {
        if (clipPath !== null) {
            group.append(clipPath);
        }
        group.append(strokePath);
    });
    return group;
};

export const getStrokesSvgBase = (character: CharacterSvgData, options: StrokesAnimationOptions, uniqueId: string): SvgComponents => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", character.viewBox);

    const viewBox = parseViewBox(character.viewBox);

    const background = createBackground(options, viewBox);
    if (background !== null) {
        svg.append(background);
    }

    const grid = createGrid(options, viewBox);
    if (grid !== null) {
        svg.append(grid);
    }

    const group = document.createElementNS(svgNS, "g");
    if (character.transform !== null) {
        group.setAttributeNS(null, "transform", character.transform);
    }
    svg.append(group);

    const preview = createPreview(character, options, uniqueId);
    if (preview !== null) {
        group.append(preview);
    }

    const strokesComponents = getStrokesComponents({ character, strokeColor: options.strokeColor, uniqueId, isStatic: false });
    strokesComponents.forEach(({ clipPath, strokePath }) => {
        if (clipPath !== null) {
            group.append(clipPath);
        }
        group.append(strokePath);
    });

    return { svg, group, strokesComponents };
};

export const clearElement = (element: Element): void => {
    while (element.lastChild !== null) {
        element.removeChild(element.lastChild);
    }
    while (element.attributes.length > 0) {
        element.removeAttribute(element.attributes[0].name);
    }
};
