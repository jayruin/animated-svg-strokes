import { getAllSources, isSourceChecked } from "./sources.js";
import { removeAnimation, clearAnimations } from "./animations.js";
import { getDraggedElement } from "./drag-drop.js";
import { clearErrors } from "./errors.js";

export function setupTrashButton(trashButton) {
    trashButton.addEventListener("click", () => {
        getAllSources()
            .filter(source => isSourceChecked(source))
            .forEach(source => {
                clearAnimations(source);
                clearErrors(source);
            });
    });
    
    trashButton.addEventListener("dragover", event => event.preventDefault());
    
    trashButton.addEventListener("drop", event => {
        event.preventDefault();
        const draggedElement = getDraggedElement();
        if (draggedElement === null) return;
        removeAnimation(draggedElement);
    });
}
