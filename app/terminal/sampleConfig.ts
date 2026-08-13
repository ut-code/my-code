import { RuntimeLang } from "@my-code/runtime/languages";

import main_py from "./samples/main.py?raw";
import main_rb from "./samples/main.rb?raw";
import main_js from "./samples/main.js?raw";
import main2_ts from "./samples/main2.ts?raw";
import main_cpp from "./samples/main.cpp?raw";
import sub_h from "./samples/sub.h?raw";
import sub_cpp from "./samples/sub.cpp?raw";
import main2_rs from "./samples/main2.rs?raw";
import sub_rs from "./samples/sub.rs?raw";

export interface SampleConfig {
  repl: boolean;
  replInitContent?: string; // ReplOutput[] ではない。stringのパースはruntimeが行う
  editor: Record<string, string> | false;
  exec: string[] | false;
  readonlyFiles?: string[];
  supportsMultiFile?: boolean;
}

export const sampleConfig: Record<RuntimeLang, SampleConfig> = {
  python: {
    repl: true,
    replInitContent: '>>> print("Hello, World!")\nHello, World!',
    editor: {
      "main.py": main_py,
    },
    exec: ["main.py"],
    supportsMultiFile: true,
  },
  ruby: {
    repl: true,
    replInitContent: 'irb(main):001:0> puts "Hello, World!"\nHello, World!',
    editor: {
      "main.rb": main_rb,
    },
    exec: ["main.rb"],
    supportsMultiFile: true,
  },
  javascript: {
    repl: true,
    replInitContent: '> console.log("Hello, World!");\nHello, World!',
    editor: {
      "main.js": main_js,
    },
    exec: ["main.js"],
    supportsMultiFile: false,
  },
  typescript: {
    repl: false,
    editor: {
      // main.tsにすると出力ファイルがjavascriptのサンプルと被る
      "main2.ts": main2_ts,
    },
    exec: ["main2.ts"],
    readonlyFiles: ["main2.js"],
    supportsMultiFile: false,
  },
  cpp: {
    repl: false,
    editor: {
      "main.cpp": main_cpp,
      "sub.h": sub_h,
      "sub.cpp": sub_cpp,
    },
    exec: ["main.cpp", "sub.cpp"],
    supportsMultiFile: true,
  },
  rust: {
    repl: false,
    editor: {
      "main2.rs": main2_rs,
      "sub.rs": sub_rs,
    },
    exec: ["main2.rs"],
    supportsMultiFile: true,
  },
};
