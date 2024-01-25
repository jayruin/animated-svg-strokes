import { getAllSources, isSourceChecked } from "./sources.js";
import { getSelectedFormat } from "./formats.js";
import { addAnimation } from "./animations.js";
import { getAnimationOptions } from "./options.js";
import { addError } from "./errors.js";

export function setupRenderButton(renderButton, characterInput, rendererFactory) {
    async function renderSourceCharacter(character, source, options) {
        const render = rendererFactory({ source, format: getSelectedFormat(), options });
        return await render(character);
    }

    renderButton.addEventListener("click", async () => {
        const character = characterInput.value;
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
                addAnimation(r.value);
            } else if (r.status === "rejected") {
                addError(r.reason, sources[i]);
            }
        });
    });
}
