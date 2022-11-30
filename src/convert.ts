export const svgToImg = (svg: SVGElement): HTMLImageElement => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" }));
    return img;
}