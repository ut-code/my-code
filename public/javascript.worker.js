// JavaScript web worker
let jsOutput = [];
let executedCommands = []; // Store successfully executed commands for state recovery
let globalScope = {}; // Store global variables and functions

// Helper function to capture console output
function createConsoleProxy() {
  return {
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
}

async function init(id) {
  // Initialize the worker
  executedCommands = [];
  globalScope = {};
  self.postMessage({ id, payload: { success: true } });
}

async function runJavaScript(id, payload) {
  const { code } = payload;
  try {
    // Create a console proxy to capture output
    const console = createConsoleProxy();
    
    // Execute the code with eval in the global scope
    // Use Function constructor with global scope to maintain state across calls
    const func = new Function('console', 'globalScope', `
      with (globalScope) {
        return eval(${JSON.stringify(code)});
      }
    `);
    const result = func(console, globalScope);
    
    if (result !== undefined) {
      jsOutput.push({
        type: "return",
        message: String(result),
      });
    }
    
    // Save the successfully executed command for state recovery
    executedCommands.push(code);
  } catch (e) {
    console.log(e);
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
      if (e.message.includes("Unexpected end of input") || 
          e.message.includes("expected expression")) {
        self.postMessage({ id, payload: { status: "incomplete" } });
      } else {
        self.postMessage({ id, payload: { status: "invalid" } });
      }
    } else {
      self.postMessage({ id, payload: { status: "invalid" } });
    }
  }
}

async function restoreState(id) {
  // Re-execute all previously successful commands to restore state
  const commandsToRestore = [...executedCommands];
  executedCommands = []; // Clear before re-executing
  jsOutput = []; // Clear output for restoration
  const newGlobalScope = {}; // Create a fresh global scope
  
  for (const command of commandsToRestore) {
    try {
      const console = createConsoleProxy();
      const func = new Function('console', 'globalScope', `
        with (globalScope) {
          return eval(${JSON.stringify(command)});
        }
      `);
      func(console, newGlobalScope);
      executedCommands.push(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      console.error("Failed to restore command:", command, e);
    }
  }
  
  globalScope = newGlobalScope; // Update the global scope
  jsOutput = []; // Clear any output from restoration
  self.postMessage({ id, payload: { success: true } });
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;
  switch (type) {
    case "init":
      await init(id);
      return;
    case "runJavaScript":
      await runJavaScript(id, payload);
      return;
    case "checkSyntax":
      await checkSyntax(id, payload);
      return;
    case "restoreState":
      await restoreState(id);
      return;
    default:
      console.error(`Unknown message type: ${type}`);
      return;
  }
};
