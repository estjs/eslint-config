import { loadModule, wrapError } from './wasm';

function isFormatContentDebug(options) {
  return 'debug' in options && options.debug !== undefined;
}
export default class Biome {
  module;
  workspace;
  constructor(module, workspace) {
    this.module = module;
    this.workspace = workspace;
  }
  /**
   * It creates a new instance of the class {Biome}.
   */
  static async create() {
    const module = await loadModule();
    const workspace = new module.Workspace();
    const biome = new Biome(module, workspace);
    biome.registerProjectFolder();
    return biome;
  }
  /**
   * Stop this instance of Biome
   *
   * After calling `shutdown()` on this object, it should be considered
   * unusable as calling any method on it will fail
   */
  shutdown() {
    this.workspace.free();
  }
  /**
   * Allows to apply a custom configuration.
   *
   * If fails when the configuration is incorrect.
   *
   * @param configuration
   */
  applyConfiguration(configuration) {
    try {
      this.workspace.updateSettings({
        configuration,
        gitignore_matches: [],
        workspace_directory: './',
      });
    } catch (error) {
      throw wrapError(error);
    }
  }
  registerProjectFolder(path) {
    this.workspace.registerProjectFolder({
      path,
      setAsCurrentWorkspace: true,
    });
  }
  tryCatchWrapper(func) {
    try {
      return func();
    } catch (error) {
      throw wrapError(error);
    }
  }
  withFile(path, content, func) {
    return this.tryCatchWrapper(() => {
      const biomePath = {
        path,
        was_written: false,
        kind: ['Handleable'],
      };
      this.workspace.openFile({
        content,
        version: 0,
        path: biomePath,
      });

      try {
        return func(biomePath);
      } finally {
        this.workspace.closeFile({
          path: biomePath,
        });
      }
    });
  }
  /**
   * If formats some content.
   *
   * @param {string} content The content to format
   * @param {FormatContentOptions | FormatContentDebugOptions} options Options needed when formatting some content
   */
  formatContent(content, options) {
    return this.withFile(options.filePath, content, path => {
      let code = content;
      const { diagnostics } = this.workspace.pullDiagnostics({
        path,
        categories: ['Syntax'],
        max_diagnostics: Number.MAX_SAFE_INTEGER,
        only: [],
        skip: [],
      });
      const hasErrors = diagnostics.some(
        diag => diag.severity === 'fatal' || diag.severity === 'error',
      );
      if (!hasErrors) {
        if (options.range) {
          const result = this.workspace.formatRange({
            path,
            range: options.range,
          });
          code = result.code;
        } else {
          const result = this.workspace.formatFile({
            path,
          });
          code = result.code;
        }
        if (isFormatContentDebug(options)) {
          const ir = this.workspace.getFormatterIr({
            path,
          });
          return {
            content: code,
            diagnostics,
            ir,
          };
        }
      }
      return {
        content: code,
        diagnostics,
      };
    });
  }
  /**
   * Lint the content of a file.
   *
   * @param {string} content The content to lint
   * @param {LintContentOptions} options Options needed when linting some content
   */
  lintContent(content, { filePath, fixFileMode }) {
    const maybeFixedContent = fixFileMode
      ? this.withFile(filePath, content, path => {
          let code = content;
          const result = this.workspace.fixFile({
            path,
            fix_file_mode: fixFileMode,
            should_format: false,
            only: [],
            skip: [],
            rule_categories: ['Syntax', 'Lint'],
          });
          code = result.code;
          return code;
        })
      : content;
    return this.withFile(filePath, maybeFixedContent, path => {
      const { diagnostics } = this.workspace.pullDiagnostics({
        path,
        categories: ['Syntax', 'Lint'],
        max_diagnostics: Number.MAX_SAFE_INTEGER,
        only: [],
        skip: [],
      });
      return {
        content: maybeFixedContent,
        diagnostics,
      };
    });
  }
  /**
   * Print a list of diagnostics to an HTML string.
   *
   * @param {Diagnostic[]} diagnostics The list of diagnostics to print
   * @param {PrintDiagnosticsOptions} options Options needed for printing the diagnostics
   */
  printDiagnostics(diagnostics, options) {
    return this.tryCatchWrapper(() => {
      const printer = new this.module.DiagnosticPrinter(options.filePath, options.fileSource);
      try {
        for (const diag of diagnostics) {
          if (options.verbose) {
            printer.print_verbose(diag);
          } else {
            printer.print_simple(diag);
          }
        }
        return printer.finish();
      } catch (error) {
        // Only call `free` if the `print` method throws, `finish` will
        // take care of deallocating the printer even if it fails
        printer.free();
        throw error;
      }
    });
  }
}
