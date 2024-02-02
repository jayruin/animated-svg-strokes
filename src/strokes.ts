import { registerFormat, registerSource } from "./strokes-core.js";
import * as canvas2d from "./formats/canvas-2d.format.js";
import * as svgCss from "./formats/svg-css.format.js";
import * as svgSmil from "./formats/svg-smil.format.js";
import * as svgWa from "./formats/svg-wa.format.js";
import * as jaKanjivg from "./sources/ja-kanjivg.source.js";
import * as zhHanziwriter from "./sources/zh-hanziwriter.source.js";

export * from "./strokes-core.js";

registerSource({ ...jaKanjivg, source: "ja" });
registerSource({ ...zhHanziwriter, source: "zh" });

registerFormat(canvas2d);
registerFormat(svgCss);
registerFormat(svgSmil);
registerFormat(svgWa);
