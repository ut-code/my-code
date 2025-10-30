// Ruby.wasm web worker
let rubyVM = null;
let rubyOutput = [];
let rubyModule = null;

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

async function init(id, payload) {
  const { RUBY_WASM_URL, interruptBuffer } = payload;
  
  if (!rubyVM) {
    try {
      // Import the browser WASI shim
      importScripts('https://cdn.jsdelivr.net/npm/@bjorn3/browser_wasi_shim@0.3.0/dist/index.js');
      
      // Fetch and compile the Ruby WASM module
      const response = await fetch(RUBY_WASM_URL);
      const buffer = await response.arrayBuffer();
      rubyModule = await WebAssembly.compile(buffer);
      
      // Import the Ruby WASM runtime
      // We need to use the browser WASI shim
      const { WASI } = self.WASI || globalThis.WASI;
      
      // Create WASI instance
      const wasi = new WASI([], [], [
        {
          path: 'stdout',
          write: (buf) => {
            const text = new TextDecoder().decode(buf);
            rubyOutput.push({ type: 'stdout', message: text });
            return buf.byteLength;
          }
        },
        {
          path: 'stderr',
          write: (buf) => {
            const text = new TextDecoder().decode(buf);
            rubyOutput.push({ type: 'stderr', message: text });
            return buf.byteLength;
          }
        }
      ]);
      
      // Import the RubyVM from @ruby/wasm-wasi
      importScripts('https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.7.2/dist/browser.umd.js');
      const { DefaultRubyVM } = self.ruby;
      
      const { vm } = await DefaultRubyVM(rubyModule, {
        consolePrint: false
      });
      
      rubyVM = vm;
      
      // Set up stdout/stderr capture
      rubyVM.eval(`
        class << $stdout
          alias_method :original_write, :write
          def write(str)
            str
          end
        end
        
        class << $stderr
          alias_method :original_write, :write
          def write(str)
            str
          end
        end
      `);
      
    } catch (e) {
      console.error("Failed to initialize Ruby VM:", e);
      self.postMessage({ id, error: `Failed to initialize Ruby: ${e.message}` });
      return;
    }
  }
  
  self.postMessage({ id, payload: { success: true } });
}

async function runRuby(id, payload) {
  const { code } = payload;
  
  if (!rubyVM) {
    self.postMessage({ id, error: "Ruby VM not initialized" });
    return;
  }
  
  try {
    // Capture output
    rubyOutput = [];
    
    const result = rubyVM.eval(code);
    const resultStr = result.toString();
    
    // Add result to output if it's not nil
    if (resultStr !== '' && resultStr !== 'nil') {
      rubyOutput.push({
        type: 'return',
        message: resultStr
      });
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      // Clean up Ruby error messages
      let errorMessage = e.message;
      
      // Remove internal Ruby traceback lines for cleaner output
      if (errorMessage.includes('Traceback')) {
        const lines = errorMessage.split('\n');
        errorMessage = lines.filter(line => 
          !line.includes('(eval)') || 
          line.includes('Error') || 
          line.includes(':')
        ).join('\n').trim();
      }
      
      rubyOutput.push({
        type: 'error',
        message: errorMessage
      });
    } else {
      rubyOutput.push({
        type: 'error',
        message: `予期せぬエラー: ${String(e).trim()}`
      });
    }
  }
  
  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];
  
  self.postMessage({
    id,
    payload: { output, updatedFiles }
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
    
    // Write files to the virtual file system
    for (const [filename, content] of Object.entries(files)) {
      if (content) {
        rubyVM.eval(`File.write(${JSON.stringify(filename)}, ${JSON.stringify(content)})`);
      }
    }
    
    // Run the specified file
    const fileContent = files[name];
    if (!fileContent) {
      throw new Error(`File not found: ${name}`);
    }
    
    rubyVM.eval(fileContent);
    
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      let errorMessage = e.message;
      
      if (errorMessage.includes('Traceback')) {
        const lines = errorMessage.split('\n');
        errorMessage = lines.filter(line => 
          !line.includes('(eval)') || 
          line.includes('Error') || 
          line.includes(':')
        ).join('\n').trim();
      }
      
      rubyOutput.push({
        type: 'error',
        message: errorMessage
      });
    } else {
      rubyOutput.push({
        type: 'error',
        message: `予期せぬエラー: ${String(e).trim()}`
      });
    }
  }
  
  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];
  
  self.postMessage({
    id,
    payload: { output, updatedFiles }
  });
}

async function checkSyntax(id, payload) {
  const { code } = payload;
  
  if (!rubyVM) {
    self.postMessage({
      id,
      payload: { status: "invalid" }
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
    if (incompletePatterns.some(pattern => pattern.test(trimmed))) {
      self.postMessage({ id, payload: { status: "incomplete" } });
      return;
    }
    
    // Try to compile/evaluate in check mode
    try {
      rubyVM.eval(`BEGIN { raise "check" }; ${code}`);
    } catch (e) {
      // If it's our check exception, syntax is valid
      if (e.message && e.message.includes('check')) {
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
      payload: { status: "invalid" }
    });
  }
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;
  
  switch (type) {
    case "init":
      await init(id, payload);
      return;
    case "runRuby":
      await runRuby(id, payload);
      return;
    case "runFile":
      await runFile(id, payload);
      return;
    case "checkSyntax":
      await checkSyntax(id, payload);
      return;
    default:
      console.error(`Unknown message type: ${type}`);
      return;
  }
};
