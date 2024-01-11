import fs from "fs";

process.argv.slice(2).forEach(arg => fs.rm(arg, { force: true, recursive: true }, err => err === null ? null : console.error(err)));
