import type { StrokesParser, StrokesRequester } from "./types.js";
import { extractNumbers } from "./extract.js";
import { strictFetch } from "./http.js";
import { svgMediaType } from "../svg/constants.js";

export const getRequester = (group: string): StrokesRequester => async (codePoint) => {
    const url = `https://cdn.jsdelivr.net/gh/parsimonhi/animCJK/${group}/${codePoint}.svg`;
    const response = await strictFetch(url);
    return response;
};

const isStyleRule = (rule: CSSRule): rule is CSSStyleRule => rule instanceof CSSStyleRule;

const xlinkNS = "http://www.w3.org/1999/xlink";

export const parser: StrokesParser = async (response) => {
    const data = await response.text();
    const xmlDocument: XMLDocument = new DOMParser().parseFromString(data, svgMediaType);
    const viewBox = xmlDocument.querySelector("svg")?.getAttribute("viewBox");
    if (viewBox === null || typeof viewBox === "undefined") {
        throw new Error("Cannot get viewBox.");
    }
    const strokeWidth = Array.from(xmlDocument.querySelector<SVGStyleElement>("style")?.sheet?.cssRules ?? [])
        .filter(isStyleRule)
        .map((rule) => parseFloat(rule.style.strokeWidth))
        .find((num) => !isNaN(num) && isFinite(num));
    if (typeof strokeWidth === "undefined") {
        throw new Error("Cannot get strokeWidth.");
    }
    const strokes = Array.from(xmlDocument.querySelectorAll<SVGPathElement>("path[clip-path]"))
        .sort((firstEl, secondEl) => {
            const [firstNum, secondNum] = [firstEl, secondEl].map((el) => {
                const text = el.getAttribute("clip-path");
                if (text === null) {
                    throw new Error("Cannot get clip-path.");
                }
                return extractNumbers(text)[1];
            });
            return firstNum - secondNum;
        })
        .map((element) => {
            const strokePath = element.getAttribute("d");
            if (strokePath === null) {
                throw new Error("Cannot get strokePath.");
            }
            const clipPath = xmlDocument.getElementById(
                xmlDocument.getElementById(
                    (element.getAttribute("clip-path") ?? "")
                        .replace("url", "")
                        .replace("(", "")
                        .replace(")", "")
                        .replace("#", ""),
                )?.querySelector("use")?.getAttributeNS(xlinkNS, "href")?.replace("#", "") ?? "",
            )?.getAttribute("d");
            if (clipPath === null || typeof clipPath === "undefined") {
                throw new Error("Cannot get clipPath.");
            }
            return {
                clipPath,
                strokePath,
                strokeWidth,
            };
        });
    return {
        strokes,
        transform: null,
        viewBox,
    };
};
