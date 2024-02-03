import type { StrokesParser, StrokesRequester } from "./types.js";
import type { Stroke } from "../characters/types.js";
import { extractNumbers } from "./extract.js";
import { strictFetch } from "./http.js";
import { svgMediaType } from "../svg/constants.js";

export const source = "ja-kanjivg";

export const requester: StrokesRequester = async (codePoint) => {
    const characterCode = codePoint.toString(16).padStart(5, "0");
    const characterFile = `${characterCode}.svg`;
    const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${characterFile}`;
    const response = await strictFetch(url);
    return response;
};

export const parser: StrokesParser = async (response) => {
    const data = await response.text();
    const xmlDocument: XMLDocument = new DOMParser().parseFromString(data, svgMediaType);
    const viewBox = xmlDocument.querySelector("svg")?.getAttribute("viewBox");
    if (viewBox === null || typeof viewBox === "undefined") {
        throw new Error("Cannot get viewBox.");
    }
    const strokeWidth = Array.from(xmlDocument.querySelectorAll<SVGGElement>("g[style]"))
        .map((element) => parseFloat(element.style.getPropertyValue("stroke-width")))
        .find((num) => !isNaN(num) && isFinite(num));
    if (typeof strokeWidth === "undefined") {
        throw new Error("Cannot get strokeWidth.");
    }
    const strokes: Stroke[] = Array.from(xmlDocument.querySelectorAll("path"))
        .sort((firstEl, secondEl) => {
            const [firstNum, secondNum] = [firstEl, secondEl].map((el) => {
                const id = el.getAttribute("id");
                if (id === null) {
                    throw new Error("Cannot get id.");
                }
                return extractNumbers(id)[1];
            });
            return firstNum - secondNum;
        })
        .map((element) => {
            const d = element.getAttribute("d");
            if (d === null) {
                throw new Error("Cannot get d.");
            }
            return d;
        })
        .map((d) => ({
            clipPath: null,
            strokePath: d,
            strokeWidth,
        }));
    return {
        strokes,
        transform: null,
        viewBox,
    };
};
