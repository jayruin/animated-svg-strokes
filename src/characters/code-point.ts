export const getCodePoint = (characterString: string): number => {
    if (typeof characterString !== "string") throw new TypeError("characterString must be a string.");
    if (characterString.length !== 1) throw new RangeError("Must be a single character.");
    const codePoint = characterString.codePointAt(0);
    if (typeof codePoint === "undefined") throw new RangeError("Cannot get code point.");
    return codePoint;
};
