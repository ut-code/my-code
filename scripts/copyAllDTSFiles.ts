// node_modules/typescript/lib からd.tsファイルをすべてpublic/typescript/version/にコピーする。

import { knownLibFilesForCompilerOptions } from "@typescript/vfs";
import { compilerOptions } from "../app/terminal/typescript/runtime";
import ts from "typescript";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const libFiles = knownLibFilesForCompilerOptions(compilerOptions, ts);

const destDir = `./public/typescript/${ts.version}/`;
await fs.mkdir(destDir, { recursive: true });

for (const libFile of libFiles) {
  const srcPath = `./node_modules/typescript/lib/${libFile}`;
  const destPath = `${destDir}${libFile}`;
  if(existsSync(srcPath)) {
    await fs.copyFile(srcPath, destPath);
    console.log(`Copied ${libFile} to ${destPath}`);
  } else {
    console.warn(`Source file does not exist: ${srcPath}`);
  }
}
