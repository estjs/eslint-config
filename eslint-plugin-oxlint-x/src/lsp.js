import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import process from 'node:process';
import {
  StreamMessageReader,
  StreamMessageWriter,
  createMessageConnection,
} from 'vscode-jsonrpc/node.js';

// Singleton client instance.
let clientInstance;

const requireFn = createRequire(import.meta.url);

/**
 * Very small wrapper around vscode-jsonrpc MessageConnection that exposes a
 * `lint` helper returning diagnostics for the provided file.
 */
class OxlintClient {
  constructor() {
    const { command, args } = resolveServerBinary();

    // Spawn the native server in stdio mode (LSP over stdin/stdout).
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        // Let server know we are an ESLint integration.
        ESLINT_INTEGRATION: '1',
      },
    });

    const reader = new StreamMessageReader(child.stdout);
    const writer = new StreamMessageWriter(child.stdin);
    this.connection = createMessageConnection(reader, writer);

    // Map uri -> resolver functions waiting for diagnostics.
    this.pending = new Map();

    // Receive publishDiagnostics notifications.
    this.connection.onNotification('textDocument/publishDiagnostics', params => {
      const key = params.uri;
      const resolver = this.pending.get(key);
      if (resolver) {
        resolver(params.diagnostics || []);
        this.pending.delete(key);
      }
    });

    this.connection.listen();

    // Initialize protocol (fire and forget).
    this.connection
      .sendRequest('initialize', {
        processId: process.pid,
        rootUri: null,
        capabilities: {},
      })
      .catch(() => {
        /* ignore */
      });
    this.connection.notify('initialized', {});

    // Ensure proper shutdown when Node process exits.
    const dispose = () => {
      this.dispose();
    };
    process.once('exit', dispose);
    process.once('SIGINT', () => {
      dispose();
      process.exit(130);
    });
    process.once('SIGTERM', dispose);
  }

  /**
   * Lint a document (string content). Returns a Promise of LSP Diagnostics[].
   * Currently performs didOpen each time (could be optimized).
   */
  lint({ uri, languageId, text }) {
    const diagnosticsP = new Promise(resolve => {
      this.pending.set(uri, diagnostics => {
        // After we have diagnostics, immediately send didClose to free server memory.
        this.connection.notify('textDocument/didClose', { textDocument: { uri } });
        resolve(diagnostics);
      });
    });

    this.connection.notify('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: languageId || inferLanguageId(uri),
        version: 1,
        text,
      },
    });

    return diagnosticsP;
  }

  dispose() {
    try {
      this.connection.sendRequest('shutdown').catch(() => {});
      this.connection.notify('exit');
      this.connection.end();
    } catch {
      /* ignore */
    }
  }
}

/**
 * Resolve the appropriate oxc_language_server binary for the current platform.
 * For now we assume the shim package provides an executable on the PATH.
 */
function resolveServerBinary() {
  // Simple heuristic: prefer the JS shim if available.
  try {
    const jsShim = requireFn.resolve('oxc_language_server');
    return { command: process.execPath, args: [jsShim] };
  } catch {
    // Fallback: rely on direct binary in PATH.
    return { command: 'oxc_language_server', args: [] };
  }
}

function inferLanguageId(uri) {
  if (uri.endsWith('.ts') || uri.endsWith('.tsx')) return 'typescript';
  if (uri.endsWith('.jsx') || uri.endsWith('.js')) return 'javascript';
  if (uri.endsWith('.vue')) return 'vue';
  return 'javascript';
}

export function getClient() {
  if (!clientInstance) {
    clientInstance = new OxlintClient();
  }
  return clientInstance;
}
