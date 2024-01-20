import { defineConfig } from "vitest/config";

import fs from "fs";
import path from "path";

const src = path.resolve(__dirname, "src");
const tests = path.resolve(__dirname, "tests");

const isSubPath = (parent, child) => {
    const relativePath = path.relative(parent, child);
    return !relativePath.startsWith("..");
};

// TODO get rid of customResolver once vitest or vite-tsconfig-paths supports tsconfig rootDirs
const customResolver = (source, importer) => {
    if (source.startsWith("./") && source.endsWith(".js") && isSubPath(tests, importer)) {
        const parsedPath = path.parse(path.resolve(src, path.relative(tests, path.resolve(path.dirname(importer), source))));
        const newPath = path.format({ ...parsedPath, base: "", ext: ".ts" });
        if (fs.existsSync(newPath)) {
            return newPath;
        }
    }
};

export default defineConfig({
    test: {
        browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            name: "chromium",
        },
        alias: [
            {
                find: "./",
                replacement: "./",
                customResolver,
            },
        ],
    },
});
