import type { CharacterInfo, StrokeInfo } from "./interfaces";
import { getPathLength } from "./loading";

export const jaLoad = async (character: string): Promise<CharacterInfo> => {
    const characterCode = character.codePointAt(0)?.toString(16).padStart(5, "0");
    if (typeof characterCode === "undefined") {
        throw new Error("characterCode is undefined!");
    }
    const characterFile = `${characterCode}.svg`;
    const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${characterFile}`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.text();
    const xmlDocument: XMLDocument = new DOMParser().parseFromString(data, "image/svg+xml");
    const viewBox = xmlDocument.querySelector("svg")?.getAttribute("viewBox");
    if (viewBox === null || typeof viewBox === "undefined") {
        throw new Error("viewBox is null or undefined!");
    }
    const strokes: StrokeInfo[] = Array.from(xmlDocument.querySelectorAll("path"))
        .sort((firstEl, secondEl) => {
            const [firstNum, secondNum] = [firstEl, secondEl].map(el => {
                const id = el.getAttribute("id");
                if (id === null) {
                    throw new Error("id is null!");
                }
                return parseInt(id.substring(id.indexOf("-s")), 10);
            });
            return firstNum - secondNum;
        })
        .map(element => {
            const d = element.getAttribute("d");
            if (d === null) {
                throw new Error("d is null!");
            }
            return d;
        })
        .map(d => ({
            clipPath: null,
            strokePath: d,
            strokePathLength: getPathLength(d),
        }));
    const strokeWidth = Array.from(xmlDocument.querySelectorAll<SVGGElement>("g[style]"))
        .map(element => parseFloat(element.style.getPropertyValue("stroke-width")))
        .find(num => !isNaN(num) && isFinite(num));
    if (typeof strokeWidth === "undefined") {
        throw new Error("strokeWidth is undefined!");
    }
    return {
        character,
        strokeWidth,
        strokes,
        transform: null,
        type: "ja",
        viewBox,
    };
};
