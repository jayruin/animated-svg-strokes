export const validateCharacter = (character: string): void => {
    if (character.length !== 1) {
        throw new Error("Must be a single character!");
    }
};
