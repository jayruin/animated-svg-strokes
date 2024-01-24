import { getAllSources, isSourceChecked } from "./sources.js";
import { getSelectedFormat } from "./formats.js";
import { addAnimation } from "./animations.js";

const animationOptions = { totalStrokeDuration: 0.5 };

export function setupRenderButton(renderButton, characterInput, rendererFactory) {
    renderButton.addEventListener("click", async () => {
        const character = characterInput.value;
        const promises = [];
        for (const source of getAllSources()) {
            const shouldRender = isSourceChecked(source);
            promises.push(shouldRender ? rendererFactory({ source, format: getSelectedFormat(), options: animationOptions })(character) : Promise.resolve(null));
        }
        const animations = await Promise.all(promises.values());
        animations.forEach(animation => addAnimation(animation));
    });
}
