import { svgNS } from "./constants.js";

export const getTransformMatrix = (transform: string): DOMMatrixReadOnly => {
    const svgElement = document.createElementNS(svgNS, "svg");
    svgElement.setAttributeNS(null, "transform", transform);
    const svgTransform = svgElement.transform.baseVal.consolidate();
    if (svgTransform === null) {
        throw new Error("Cannot get svg transform.");
    }
    return svgTransform.matrix;
};
