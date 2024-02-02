import fs from "fs/promises";
import path from "path";

import * as esbuild from "esbuild";

const langs = [
    "ja",
    "zh",
];
const sourcesDirectory = "src/sources";
const sources = (await fs.readdir(sourcesDirectory, { recursive: true }))
    .filter(f => langs.some(l => f.startsWith(`${l}-`)) && f.endsWith(".ts"))
    .map(f => path.join(sourcesDirectory, f));

await esbuild.build({
    entryPoints: ["src/strokes.ts"].concat(sources).map(f => ({ out: path.parse(f).name, in: f })),
    outdir: "dist",
    format: "esm",
    bundle: true,
    minify: true,
    logLevel: "info",
});
