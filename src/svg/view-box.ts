import type { ViewBox } from "./types";

export const parseViewBox = (viewBox: string): ViewBox => {
    const [minX, minY, width, height] = viewBox.split(" ").map((value) => parseInt(value, 10));
    return { minX, minY, width, height };
};
