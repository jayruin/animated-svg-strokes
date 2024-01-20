import fs from "fs";
import path from "path";
import url from "url";

const encodeTestData = (currPath) => {
    const stats = fs.lstatSync(currPath);
    if (stats.isDirectory()) {
        if (path.basename(currPath).endsWith(".data")) {
            const encodedFilePath = `${currPath}.ts`;
            const lines = fs.readdirSync(currPath)
                .map(f => path.resolve(currPath, f))
                .filter(f => fs.lstatSync(f).isFile())
                .map(f => {
                    const name = path.basename(f).replace(".", "");
                    const base64String = fs.readFileSync(f, { encoding: "base64" });
                    return `export const \$${name}: string = "${base64String}";`;
                });
            fs.writeFileSync(encodedFilePath, lines.join("\n"));
        } else {
            for (const name of fs.readdirSync(currPath)) {
                encodeTestData(path.resolve(currPath, name));
            }
        }
    }
};

const repoRoot = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));
const testsRoot = path.resolve(repoRoot, "tests");
encodeTestData(testsRoot);
