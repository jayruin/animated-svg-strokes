import type { AnimationOptions, CharacterInfo, Point, SvgComponents, SvgStrokeComponents } from "./interfaces";

export const svgNS = "http://www.w3.org/2000/svg";

const createLine = (startPoint: Point, endPoint: Point, stroke: string): SVGLineElement => {
    const line = document.createElementNS(svgNS, "line");
    line.setAttributeNS(null, "x1", startPoint.x.toString());
    line.setAttributeNS(null, "y1", startPoint.y.toString());
    line.setAttributeNS(null, "x2", endPoint.x.toString());
    line.setAttributeNS(null, "y2", endPoint.y.toString());
    line.setAttributeNS(null, "stroke", stroke);
    line.setAttributeNS(null, "stroke-width", "1%");
    return line;
};

export const drawGrid = (svg: SVGSVGElement): void => {
    const viewBox = svg.getAttribute("viewBox");
    if (viewBox === null) {
        throw new Error("svg element has no viewBox");
    }
    const [, , width, height] = viewBox.split(" ").map(value => parseInt(value, 10));
    svg.appendChild(createLine({ x: width / 2, y: 0 }, { x: width / 2, y: height }, "#DDD"));
    svg.appendChild(createLine({ x: 0, y: height / 2 }, { x: width, y: height / 2 }, "#DDD"));
};

export const svgStrokesBase = (characterInfo: CharacterInfo, options: AnimationOptions): SvgComponents => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttributeNS(null, "viewBox", characterInfo.viewBox);

    if (options.includeGrid) {
        drawGrid(svg);
    }

    const group = document.createElementNS(svgNS, "g");
    if (characterInfo.transform !== null) {
        group.setAttributeNS(null, "transform", characterInfo.transform);
    }
    svg.appendChild(group);

    const strokesComponents: SvgStrokeComponents[] = [];

    for (let strokeNumber = 0; strokeNumber < characterInfo.strokes.length; strokeNumber += 1) {
        const strokeInfo = characterInfo.strokes[strokeNumber];

        const strokePath = document.createElementNS(svgNS, "path");
        strokePath.setAttributeNS(null, "d", strokeInfo.strokePath);

        let clipPathElement = null;
        let clipPathPathElement = null;
        if (strokeInfo.clipPath !== null) {
            const clipPathId = `${characterInfo.character}-${characterInfo.type}-clipPath-${strokeNumber}`;
            clipPathElement = document.createElementNS(svgNS, "clipPath");
            clipPathElement.setAttributeNS(null, "id", clipPathId);
            group.appendChild(clipPathElement);
            strokePath.setAttributeNS(null, "clip-path", `url(#${clipPathId})`);

            clipPathPathElement = document.createElementNS(svgNS, "path");
            clipPathPathElement.setAttributeNS(null, "d", strokeInfo.clipPath);
            clipPathElement.appendChild(clipPathPathElement);
        }

        strokePath.setAttributeNS(null, "fill", "none");
        strokePath.setAttributeNS(null, "stroke", "#000");
        strokePath.setAttributeNS(null, "stroke-linecap", "round");
        strokePath.setAttributeNS(null, "stroke-linejoin", "round");

        group.appendChild(strokePath);

        strokesComponents.push({ clipPath: clipPathElement, clipPathPath: clipPathPathElement, strokePath });
    }

    return { svg, group, strokesComponents };
};
