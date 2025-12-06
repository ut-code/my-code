declare module "ace-builds/src-min-noconflict/*";
declare module "prismjs/components/*";
declare module "mocha/mocha.js";

declare module "*?raw" {
  const contents: string;
  export = contents;
}
