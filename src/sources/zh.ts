import type { StrokesParser, StrokesRequester } from "./types";
import type { Stroke } from "../characters/types";
import { strictFetch } from "./http";

export const SOURCE_ZH = "zh";

interface HanziWriterData {
    strokes: string[];
    medians: number[][][];
}

const isDataValid = (data: unknown): data is HanziWriterData => typeof data === "object" && data !== null && "strokes" in data && "medians" in data;

export const zhRequest: StrokesRequester = async (codePoint) => {
    const characterString = String.fromCodePoint(codePoint);
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data/${characterString}.json`;
    const response = await strictFetch(url);
    return response;
};

export const zhParse: StrokesParser = async (response) => {
    const data: unknown = await response.json();
    if (!isDataValid(data)) {
        throw new Error("Data is invalid.");
    }
    const strokeWidth = 128;
    const strokes: Stroke[] = [];
    for (let strokeNumber = 0; strokeNumber < Math.min(data.strokes.length, data.medians.length); strokeNumber += 1) {
        const strokePath = data.medians[strokeNumber].map((m, i) => [i === 0 ? "M" : "L", m[0].toString(), m[1].toString()].join(" ")).join(" ");
        strokes.push({
            clipPath: data.strokes[strokeNumber],
            strokePath,
            strokeWidth,
        });
    }
    return {
        strokes,
        transform: "scale(1, -1) translate(0, -900)",
        viewBox: "0 0 1024 1024",
    };
};
