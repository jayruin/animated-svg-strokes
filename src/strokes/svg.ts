import type { Point } from "./interfaces";

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
