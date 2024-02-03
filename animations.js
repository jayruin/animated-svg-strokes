import { getCounter } from "./counter.js";
import { getDraggedElement, setDraggedElement } from "./drag-drop.js";
import { getOutputsContainer } from "./sources.js";

const animations = new Map();

function createAnimationId(animation) {
    return [
        "animation",
        animation.codePoint,
        animation.source,
        animation.format,
        getCounter().toString(),
    ].join("_");
}

function parseAnimationId(id) {
    const parts = id.split("_");
    if (parts.length !== 5 || parts[0] !== "animation") return null;
    const [codePoint, source, format, counter] = parts.slice(1);
    return { codePoint, source, format, counter };
}

export function addAnimation(animation) {
    if (animation === null) {
        return;
    }
    animation.resume();
    const animationElement = animation.element;
    animationElement.classList.add("animation");
    const animationContainer = document.createElement("div");
    animationContainer.draggable = true;
    animationContainer.id = createAnimationId(animation);
    animationContainer.classList.add("animation-container");
    animationContainer.append(animationElement);
    animationContainer.addEventListener("click", event => {
        event.preventDefault();
        if (animation.isPaused()) {
            animation.resume();
        } else {
            animation.pause();
        }
    });
    animationContainer.addEventListener("dragstart", event => setDraggedElement(event.target));
    animationContainer.addEventListener("dragover", event => {
        const draggedElement = getDraggedElement();
        const draggedIdParts = parseAnimationId(draggedElement.id);
        const targetIdParts = parseAnimationId(event.target.id);
        if (draggedIdParts === null || targetIdParts === null || draggedIdParts.source !== targetIdParts.source || event.target === draggedElement) {
            return;
        }
        event.preventDefault();
        const ratio = event.offsetY / event.target.offsetHeight;
        if (ratio <= 0.5) {
            event.target.before(draggedElement);
        } else {
            event.target.after(draggedElement);
        }
    });
    animationContainer.addEventListener("dragend", () => setDraggedElement(null));
    getOutputsContainer(animation.source).prepend(animationContainer);
    if (!animations.has(animation.source)) {
        animations.set(animation.source, []);
    }
    animations.get(animation.source).push(animation);
}

export function removeAnimation(animationContainer) {
    const animationId = animationContainer.id;
    const idParts = parseAnimationId(animationId);
    if (idParts === null) return;
    const sourceAnimations = animations.get(idParts.source);
    const animationElement = animationContainer.querySelector(".animation");
    const index = sourceAnimations.findIndex(a => a.element === animationElement);
    if (index > -1) {
        const animation = sourceAnimations[index];
        animation.dispose();
        sourceAnimations.splice(index, 1);
        animationContainer.remove();
    }
}

export function clearAnimations(source) {
    for (const animationContainer of getOutputsContainer(source).querySelectorAll(".animation-container")) {
        removeAnimation(animationContainer);
    }
}
