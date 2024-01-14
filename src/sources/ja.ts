import type { StrokesParser, StrokesRequester } from "./types";
import type { Stroke } from "../characters/types";
import { svgMediaType } from "../svg/constants";

export const SOURCE_JA = "ja";

export const jaRequest: StrokesRequester = async (codePoint) => {
    const characterCode = codePoint.toString(16).padStart(5, "0");
    const characterFile = `${characterCode}.svg`;
    const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${characterFile}`;
    const response = await fetch(url, { cache: "no-store" });
    return response;
};

export const jaParse: StrokesParser = async (response) => {
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
                return parseInt(id.substring(id.indexOf("-s")), 10);
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
