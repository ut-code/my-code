// JavaScript web worker
let jsOutput = [];

// Helper function to capture console output
const originalConsole = globalThis.console;
globalThis.console = {
  log: (...args) => {
    jsOutput.push({ type: "stdout", message: args.join(" ") });
  },
  error: (...args) => {
    jsOutput.push({ type: "stderr", message: args.join(" ") });
  },
  warn: (...args) => {
    jsOutput.push({ type: "stderr", message: args.join(" ") });
  },
  info: (...args) => {
    jsOutput.push({ type: "stdout", message: args.join(" ") });
  },
};

async function init(id, payload) {
  // Initialize the worker and report capabilities
  self.postMessage({
    id,
    payload: { capabilities: { interrupt: "restart" } },
  });
}

async function runCode(id, payload) {
  const { code } = payload;
  try {
    // Execute code directly with eval in the worker global scope
    // This will preserve variables across calls
    const result = globalThis.eval(code);

    if (result !== undefined) {
      jsOutput.push({
        type: "return",
        message: String(result),
      });
    }
  } catch (e) {
    originalConsole.log(e);
    if (e instanceof Error) {
      jsOutput.push({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      jsOutput.push({
        type: "error",
        message: `予期せぬエラー: ${String(e)}`,
      });
    }
  }

  const output = [...jsOutput];
  jsOutput = []; // Clear output

  self.postMessage({
    id,
    payload: { output, updatedFiles: [] },
  });
}

function runFile(id, payload) {
  const output = [
    {
      type: "error",
      message: "File execution is not supported in this runtime",
    },
  ];
  self.postMessage({
    id,
    payload: { output, updatedFiles: [] },
  });
}

async function checkSyntax(id, payload) {
  const { code } = payload;

  try {
    // Try to create a Function to check syntax
    new Function(code);
    self.postMessage({ id, payload: { status: "complete" } });
  } catch (e) {
    // Check if it's a syntax error or if more input is expected
    if (e instanceof SyntaxError) {
      // Simple heuristic: check for "Unexpected end of input"
      if (
        e.message.includes("Unexpected end of input") ||
        e.message.includes("expected expression")
      ) {
        self.postMessage({ id, payload: { status: "incomplete" } });
      } else {
        self.postMessage({ id, payload: { status: "invalid" } });
      }
    } else {
      self.postMessage({ id, payload: { status: "invalid" } });
    }
  }
}

async function restoreState(id, payload) {
  // Re-execute all previously successful commands to restore state
  const { commands } = payload;
  jsOutput = []; // Clear output for restoration

  for (const command of commands) {
    try {
      globalThis.eval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      originalConsole.error("Failed to restore command:", command, e);
    }
  }

  jsOutput = []; // Clear any output from restoration
  self.postMessage({ id, payload: {} });
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
      runFile(id, payload);
      return;
    case "checkSyntax":
      await checkSyntax(id, payload);
      return;
    case "restoreState":
      await restoreState(id, payload);
      return;
    default:
      originalConsole.error(`Unknown message type: ${type}`);
      return;
  }
};
