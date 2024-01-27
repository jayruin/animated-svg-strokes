const currentUrl = new URL(document.location.href);

export const searchParams = currentUrl.searchParams;

const urlSnapshotButton = document.getElementById("url-snapshot-button");
urlSnapshotButton.addEventListener("click", () => navigator.clipboard.writeText(currentUrl.toString()));
