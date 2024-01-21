export type WasmNodejs = typeof import('@biomejs/wasm-nodejs');
export async function loadModule(): Promise<WasmNodejs {
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
	public stackTrace: string;
	private constructor(stackTrace: string) {
		super();
		this.stackTrace = stackTrace;
	}

	static fromError(e: unknown): WasmError {
		return new WasmError(e as string);
	}
}

/**
 * Creates wrap a WebAssembly error into a native JS Error
 *
 * @param e
 */
export function wrapError(e: unknown): WasmError {
	return WasmError.fromError(e);
}
