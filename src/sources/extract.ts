export const extractNumbers = (text: string): number[] => {
    const regex = /[-]?\d+(?:\.\d+)?/gu;
    return text.match(regex)?.map((s) => parseFloat(s)) ?? [];
};
