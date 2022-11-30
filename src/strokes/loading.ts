import type { CharacterInfo, StrokeInfo, } from "./interfaces";

interface HanziWriterData {
    strokes: string[];
    medians: number[][][];
}

export const zhLoad = async(character: string): Promise<CharacterInfo> => {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data/${character}.json`;
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json() as HanziWriterData;
    const strokes: StrokeInfo[] = [];
    for (let strokeNumber = 0; strokeNumber < Math.min(data.strokes.length, data.medians.length); strokeNumber += 1) {
        strokes.push({
            clipPath: data.strokes[strokeNumber],
            strokePath: data.medians[strokeNumber].map((m, i) => [i === 0 ? "M" : "L", m[0].toString(), m[1].toString(),].join(" ")).join(" "),
        });
    }
    return {
        character,
        strokeWidth: 128,
        strokes,
        transform: "scale(1, -1) translate(0, -900)",
        type: "zh",
        viewBox: "0 0 1024 1024",
    };
}

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
}