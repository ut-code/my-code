// Ruby.wasm web worker
let rubyVM = null;
let rubyOutput = [];
let stdoutBuffer = "";
let stderrBuffer = "";

const RUBY_JS_URL =
  "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.2/dist/browser.umd.js";
const RUBY_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@2.7.2/dist/ruby+stdlib.wasm";

globalThis.stdout = {
  write(str) {
    stdoutBuffer += str;
  },
};
globalThis.stderr = {
  write(str) {
    stderrBuffer += str;
  },
};

async function init(id, payload) {
  // const { } = payload;

  if (!rubyVM) {
    try {
      importScripts(RUBY_JS_URL);

      // Fetch and compile the Ruby WASM module
      const rubyModule = await WebAssembly.compileStreaming(
        await fetch(RUBY_WASM_URL)
      );
      const { DefaultRubyVM } = globalThis["ruby-wasm-wasi"];
      const { vm } = await DefaultRubyVM(rubyModule);
      rubyVM = vm;

      rubyVM.eval(`
$stdout = Object.new.tap do |obj|
  def obj.write(str)
    require "js"
    JS.global[:stdout].write(str)
  end
end
$stderr = Object.new.tap do |obj|
  def obj.write(str)
    require "js"
    JS.global[:stderr].write(str)
  end
end
`);
    } catch (e) {
      console.error("Failed to initialize Ruby VM:", e);
      self.postMessage({
        id,
        error: `Failed to initialize Ruby: ${e.message}`,
      });
      return;
    }
  }

  self.postMessage({
    id,
    payload: { success: true, capabilities: { interrupt: "restart" } },
  });
}

function flushOutput() {
  if (stdoutBuffer) {
    const lines = stdoutBuffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      rubyOutput.push({ type: "stdout", message: lines[i] });
    }
    stdoutBuffer = lines[lines.length - 1];
  }
  // Final flush if there's remaining non-empty text
  if (stdoutBuffer && stdoutBuffer.trim()) {
    rubyOutput.push({ type: "stdout", message: stdoutBuffer });
  }
  stdoutBuffer = "";

  if (stderrBuffer) {
    const lines = stderrBuffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      rubyOutput.push({ type: "stderr", message: lines[i] });
    }
    stderrBuffer = lines[lines.length - 1];
  }
  if (stderrBuffer && stderrBuffer.trim()) {
    rubyOutput.push({ type: "stderr", message: stderrBuffer });
  }
  stderrBuffer = "";
}

function formatRubyError(error) {
  if (!(error instanceof Error)) {
    return `予期せぬエラー: ${String(error).trim()}`;
  }

  return error.message;
}

async function runCode(id, payload) {
  const { code } = payload;

  if (!rubyVM) {
    self.postMessage({ id, error: "Ruby VM not initialized" });
    return;
  }

  try {
    rubyOutput = [];
    stdoutBuffer = "";
    stderrBuffer = "";

    const result = rubyVM.eval(code);

    // Flush any buffered output
    flushOutput();

    const resultStr = result.toString();

    // Add result to output if it's not nil and not empty
    if (resultStr !== "" && resultStr !== "nil") {
      rubyOutput.push({
        type: "return",
        message: resultStr,
      });
    }
  } catch (e) {
    console.log(e);
    flushOutput();

    rubyOutput.push({
      type: "error",
      message: formatRubyError(e),
    });
  }

  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  });
}

async function runFile(id, payload) {
  const { name, files } = payload;

  if (!rubyVM) {
    self.postMessage({ id, error: "Ruby VM not initialized" });
    return;
  }

  try {
    rubyOutput = [];
    stdoutBuffer = "";
    stderrBuffer = "";

    // Write files to the virtual file system
    for (const [filename, content] of Object.entries(files)) {
      if (content) {
        rubyVM.eval(
          `File.write(${JSON.stringify(filename)}, ${JSON.stringify(content)})`
        );
      }
    }

    // Run the specified file
    const fileContent = files[name];
    if (!fileContent) {
      throw new Error(`File not found: ${name}`);
    }

    rubyVM.eval(fileContent);

    // Flush any buffered output
    flushOutput();
  } catch (e) {
    console.log(e);
    flushOutput();

    rubyOutput.push({
      type: "error",
      message: formatRubyError(e),
    });
  }

  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  });
}

async function checkSyntax(id, payload) {
  const { code } = payload;

  if (!rubyVM) {
    self.postMessage({
      id,
      payload: { status: "invalid" },
    });
    return;
  }

  try {
    // Try to parse the code to check syntax
    // Ruby doesn't have a built-in compile_command like Python
    // We'll use a simple heuristic
    const trimmed = code.trim();

    // Check for incomplete syntax patterns
    const incompletePatterns = [
      /\bif\b.*(?<!then)$/,
      /\bdef\b.*$/,
      /\bclass\b.*$/,
      /\bmodule\b.*$/,
      /\bdo\b\s*$/,
      /\bbegin\b\s*$/,
      /\{[^}]*$/,
      /\[[^\]]*$/,
      /\([^)]*$/,
    ];

    // Check if code ends with a continuation pattern
    if (incompletePatterns.some((pattern) => pattern.test(trimmed))) {
      self.postMessage({ id, payload: { status: "incomplete" } });
      return;
    }

    // Try to compile/evaluate in check mode
    try {
      rubyVM.eval(`BEGIN { raise "check" }; ${code}`);
    } catch (e) {
      // If it's our check exception, syntax is valid
      if (e.message && e.message.includes("check")) {
        self.postMessage({ id, payload: { status: "complete" } });
        return;
      }
      // Otherwise it's a syntax error
      self.postMessage({ id, payload: { status: "invalid" } });
      return;
    }

    self.postMessage({ id, payload: { status: "complete" } });
  } catch (e) {
    console.error("Syntax check error:", e);
    self.postMessage({
      id,
      payload: { status: "invalid" },
    });
  }
}

// Helper function to read all files from the virtual file system
function readAllFiles() {
  if (!rubyVM) return [];
  const updatedFiles = [];

  try {
    // Get list of files in the home directory
    const result = rubyVM.eval(`
      require 'json'
      files = {}
      Dir.glob('*').each do |filename|
        if File.file?(filename)
          files[filename] = File.read(filename)
        end
      end
      JSON.generate(files)
    `);
    const filesObj = JSON.parse(result.toString());
    for (const [filename, content] of Object.entries(filesObj)) {
      updatedFiles.push([filename, content]);
    }
  } catch (e) {
    console.error("Error reading files:", e);
  }

  return updatedFiles;
}

async function restoreState(id, payload) {
  // Re-execute all previously successful commands to restore state
  const { commands } = payload;
  if (!rubyVM) {
    self.postMessage({ id, error: "Ruby VM not initialized" });
    return;
  }

  rubyOutput = []; // Clear output for restoration
  stdoutBuffer = "";
  stderrBuffer = "";

  for (const command of commands) {
    try {
      rubyVM.eval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      console.error("Failed to restore command:", command, e);
    }
  }

  // Clear any output from restoration
  flushOutput();
  rubyOutput = [];

  self.postMessage({ id, payload: { success: true } });
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;

  switch (type) {
    case "init":
      await init(id, payload);
      return;
    case "runCode":
      await runCode(id, payload);
      return;
    case "runFile":
      await runFile(id, payload);
      return;
    case "checkSyntax":
      await checkSyntax(id, payload);
      return;
    case "restoreState":
      await restoreState(id, payload);
      return;
    default:
      console.error(`Unknown message type: ${type}`);
      return;
  }
};