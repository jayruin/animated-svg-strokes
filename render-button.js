import { getCharacters } from "./characters.js";
import { getAllSources, isSourceChecked } from "./sources.js";
import { getSelectedFormat } from "./formats.js";
import { addAnimation } from "./animations.js";
import { getAnimationOptions } from "./options.js";
import { addError } from "./errors.js";

export function setupRenderButton(renderButton, rendererFactory) {
    async function renderSourceCharacter(character, source, options) {
        const render = rendererFactory({ source, format: getSelectedFormat(), options });
        const animation = await render(character);
        animation.pause();
        return animation;
    }

    renderButton.addEventListener("click", async () => {
        const characters = getCharacters().reverse();
        for (const character of characters) {
            const promises = [];
            const options = getAnimationOptions();
            const sources = getAllSources();
            for (const source of sources) {
                const shouldRender = isSourceChecked(source);
                promises.push(shouldRender ? renderSourceCharacter(character, source, options) : Promise.resolve(null));
            }
            const results = await Promise.allSettled(promises);
            results.forEach((r, i) => {
                if (r.status === "fulfilled") {
                    r.value.resume();
                    addAnimation(r.value);
                } else if (r.status === "rejected") {
                    addError(r.reason, sources[i]);
                }
            });
        }
    });
}
