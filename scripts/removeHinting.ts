import { createFont, woff2 } from "fonteditor-core";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import pako from "pako";

const fontsPath = "./node_modules/@fontsource/m-plus-rounded-1c/files/";
const cssPath = "./node_modules/@fontsource/m-plus-rounded-1c/";
const outPath = "./app/m-plus-rounded-1c-nohint/";

const weights = [400, 700];

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
    const outFileName = path.parse(file).name + `-nohint.woff`;
    await writeFile(path.join(outPath, outFileName), woffBuffer).then(() => {
      console.log(`Processed ${file} -> ${outFileName}`);
    });

    const woff2Buffer = font.write({
      type: "woff2",
      hinting: false,
      kerning: true,
    }) as Buffer;
    const outFileName2 = path.parse(file).name + `-nohint.woff2`;
    await writeFile(path.join(outPath, outFileName2), woff2Buffer).then(() => {
      console.log(`Processed ${file} -> ${outFileName2}`);
    });
  }

  async function rewriteCSS(file: string) {
    let css = await readFile(path.join(cssPath, file), "utf-8");
    css = css.replace(/url\((.+?)\)/g, (match, p1) => {
      const parsedPath = path.parse(p1);
      return `url(./${parsedPath.name}-nohint${parsedPath.ext})`;
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
      await rewriteCSS(file);
    }
  }
}
