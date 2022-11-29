export function svgToImg(svg) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    return img;
}