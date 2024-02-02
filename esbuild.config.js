import fs from "fs/promises";
import path from "path";

import * as esbuild from "esbuild";

const sourcesDirectory = "src/sources";
const sources = (await fs.readdir(sourcesDirectory, { recursive: true }))
    .filter(f => f.endsWith(".source.ts"))
    .map(f => path.join(sourcesDirectory, f));

const formatsDirectory = "src/formats";
const formats = (await fs.readdir(formatsDirectory, { recursive: true }))
    .filter(f => f.endsWith(".format.ts"))
    .map(f => path.join(formatsDirectory, f));

await esbuild.build({
    entryPoints: ["src/strokes.ts", "src/strokes-core.ts"].concat(sources).concat(formats).map(f => ({ out: path.parse(f).name, in: f })),
    outdir: "dist",
    format: "esm",
    bundle: true,
    minify: true,
    logLevel: "info",
});
