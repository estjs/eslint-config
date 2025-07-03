export async function loadModule() {
  const modulePromise = import('@biomejs/wasm-nodejs');
  const module = await modulePromise;
  module.main();
  return module;
}
/**
 * The error generated when communicating with WebAssembly
 */
class WasmError extends Error {
  /**
   * The stack trace of the error.
   *
   * It might be useful, but the first like of the stack trace contains the error
   */
  stackTrace;
  // eslint-disable-next-line unicorn/custom-error-definition
  constructor(stackTrace) {
    super();
    this.stackTrace = stackTrace;
  }

  static fromError(e) {
    return new WasmError(e);
  }
}
/**
 * Creates wrap a WebAssembly error into a native JS Error
 *
 * @param e
 */
export function wrapError(e) {
  return WasmError.fromError(e);
}
