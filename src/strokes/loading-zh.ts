import type { CharacterInfo, StrokeInfo } from "./interfaces";
import { getPathLength } from "./loading";

interface HanziWriterData {
    strokes: string[];
    medians: number[][][];
}

export const zhLoad = async (character: string): Promise<CharacterInfo> => {
    const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data/${character}.json`;
    const response = await fetch(url, { cache: "no-store" });
    const data = (await response.json()) as HanziWriterData;
    const strokes: StrokeInfo[] = [];
    for (let strokeNumber = 0; strokeNumber < Math.min(data.strokes.length, data.medians.length); strokeNumber += 1) {
        const strokePath = data.medians[strokeNumber].map((m, i) => [i === 0 ? "M" : "L", m[0].toString(), m[1].toString()].join(" ")).join(" ");
        strokes.push({
            clipPath: data.strokes[strokeNumber],
            strokePath,
            strokePathLength: getPathLength(strokePath),
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
};
