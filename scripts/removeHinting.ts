import { createFont, woff2 } from "fonteditor-core";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pako from "pako";
import crypto from "node:crypto";

const fontsPath = "./node_modules/@fontsource/m-plus-rounded-1c/files/";
const cssPath = "./node_modules/@fontsource/m-plus-rounded-1c/";
const outPath = "./public/m-plus-rounded-1c-nohint/";
const outURLBase = "/m-plus-rounded-1c-nohint";

const weights = [400, 700];
const woffHashes = new Map<string, string>();
const woff2Hashes = new Map<string, string>();

if (existsSync(outPath)) {
  console.log(`Output directory ${outPath} already exists.`);
  console.log("To regenerate font files, please delete the directory.");
} else {
  await woff2.init();
  await mkdir(outPath);

  async function removeHintingFromFont(file: string) {
    const fontBuffer = await readFile(path.join(fontsPath, file));

    const font = createFont(fontBuffer, {
      type: "woff",
      hinting: false,
      kerning: true,
      compound2simple: false,
      inflate: (data) => Array.from(pako.inflate(Uint8Array.from(data))),
    });

    const woffBuffer = font.write({
      type: "woff",
      hinting: false,
      kerning: true,
      deflate: (data) => Array.from(pako.deflate(Uint8Array.from(data))),
    }) as Buffer;
    const woffHash = crypto
      .createHash("sha256")
      .update(woffBuffer)
      .digest("hex")
      .slice(0, 8);
    woffHashes.set(path.parse(file).name, woffHash);
    const outFileName = path.parse(file).name + `-nohint-${woffHash}.woff`;
    writeFile(
      `./public/m-plus-rounded-1c-nohint/${outFileName}`,
      woffBuffer
    ).then(() => {
      console.log(`Processed ${file} -> ${outFileName}`);
    });

    const woff2Buffer = font.write({
      type: "woff2",
      hinting: false,
      kerning: true,
    }) as Buffer;
    const woff2Hash = crypto
      .createHash("sha256")
      .update(woff2Buffer)
      .digest("hex")
      .slice(0, 8);
    woff2Hashes.set(path.parse(file).name, woff2Hash);
    const outFileName2 = path.parse(file).name + `-nohint-${woff2Hash}.woff2`;
    writeFile(
      `./public/m-plus-rounded-1c-nohint/${outFileName2}`,
      woff2Buffer
    ).then(() => {
      console.log(`Processed ${file} -> ${outFileName2}`);
    });
  }

  async function rewriteCSS(file: string) {
    let css = await readFile(path.join(cssPath, file), "utf-8");
    css = css.replace(/url\((.+?)\)/g, (match, p1) => {
      const parsedPath = path.parse(p1);
      const hash =
        path.extname(p1) === ".woff"
          ? woffHashes.get(parsedPath.name)
          : woff2Hashes.get(parsedPath.name);
      return `url(${outURLBase}/${parsedPath.name}-nohint-${hash}${path.extname(p1)})`;
    });
    css = css.replaceAll(
      "font-family: 'M PLUS Rounded 1c'",
      "font-family: 'M PLUS Rounded 1c NoHint'"
    );
    await writeFile(path.join(outPath, file), css, "utf-8");
    console.log(`Rewritten CSS: ${file}`);
  }

  for (const file of await readdir(fontsPath)) {
    if (
      path.extname(file) === ".woff" &&
      weights.some((w) => file.includes(w.toString()))
    ) {
      await removeHintingFromFont(file);
    }
  }
  for (const file of await readdir(cssPath)) {
    if (
      path.extname(file) === ".css" &&
      weights.some((w) => file.includes(w.toString()))
    ) {
      rewriteCSS(file);
    }
  }
}
