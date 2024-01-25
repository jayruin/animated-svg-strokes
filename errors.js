import { getErrorsContainer } from "./sources.js";

export function addError(error, source) {
    const errorsContainer = getErrorsContainer(source);
    const div = document.createElement("div");
    div.classList.add("error");
    div.append(error.toString());
    div.addEventListener("click", () => div.remove());
    errorsContainer.prepend(div);
}

export function clearErrors(source) {
    const errorsContainer = getErrorsContainer(source);
    while (errorsContainer.firstChild) {
        errorsContainer.removeChild(errorsContainer.lastChild);
    }
}
