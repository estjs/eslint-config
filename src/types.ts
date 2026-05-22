import type { Linter } from 'eslint';
import type { ESLintRules } from 'eslint/rules';
import type { Options as PrettierOptions } from 'prettier';
import type {
  CommandRuleName,
  CommentsRuleName,
  CoreRuleName,
  ImportRuleName,
  JSDocRuleName,
  PnpmRuleName,
  ReactRuleName,
  RegexpRuleName,
  TypeScriptRuleName,
  UnicornRuleName,
  UnusedImportsRuleName,
  VitestRuleName,
  VueRuleName,
} from './rule-names';

/**
 * Flat-config item used internally. Relaxes `plugins` to `any` because upstream plugin types
 * frequently disagree with `Linter.Plugin` and our consumers re-assign to `Linter.Config[]`.
 * The optional `name` field shows up in the ESLint inspector.
 */
export type FlatConfig = Omit<Linter.Config, 'plugins'> & {
  name?: string;
  plugins?: Record<string, any>;
};

type Prefixed<Prefix extends string, Name extends string> = Name | `${Prefix}/${Name}`;

type RulesFor<Prefix extends string, Name extends string> = Partial<
  Record<Prefixed<Prefix, Name>, Linter.RuleEntry>
>;

// Per-plugin override shapes. Each accepts both bare names ("no-console")
// and fully-prefixed names ("@typescript-eslint/no-unused-vars").
export type JavaScriptRulesOverride = Partial<
  Pick<ESLintRules, Extract<CoreRuleName, keyof ESLintRules>>
> &
  Partial<Record<`unused-imports/${UnusedImportsRuleName}`, Linter.RuleEntry>>;

export type CommentsRulesOverride = RulesFor<'@eslint-community/eslint-comments', CommentsRuleName>;
export type CommandRulesOverride = RulesFor<'command', CommandRuleName>;
export type ImportRulesOverride = RulesFor<'import', ImportRuleName>;
export type JSDocRulesOverride = RulesFor<'jsdoc', JSDocRuleName>;
export type ReactRulesOverride = RulesFor<'@eslint-react', ReactRuleName>;
export type RegexpRulesOverride = RulesFor<'regexp', RegexpRuleName>;
export type TestRulesOverride = RulesFor<'vitest', VitestRuleName>;
export type TypeScriptRulesOverride = RulesFor<'@typescript-eslint', TypeScriptRuleName>;
export type UnicornRulesOverride = RulesFor<'unicorn', UnicornRuleName>;
export type VueRulesOverride = RulesFor<'vue', VueRuleName>;

export interface PnpmRulesOverride {
  json?: RulesFor<'pnpm', Extract<PnpmRuleName, `json-${string}`>>;
  yaml?: RulesFor<'pnpm', Extract<PnpmRuleName, `yaml-${string}`>>;
}

export interface RulesOverrides {
  comments?: CommentsRulesOverride;
  command?: CommandRulesOverride;
  imports?: ImportRulesOverride;
  javascript?: JavaScriptRulesOverride;
  jsdoc?: JSDocRulesOverride;
  markdown?: Linter.RulesRecord;
  pnpm?: PnpmRulesOverride;
  react?: ReactRulesOverride;
  regexp?: RegexpRulesOverride;
  test?: TestRulesOverride;
  typescript?: TypeScriptRulesOverride;
  unicorn?: UnicornRulesOverride;
  vue?: VueRulesOverride;
}

/**
 * Feature toggle. `true` / `undefined` follows the default behaviour (some toggles auto-detect
 * from installed dependencies); `false` disables.
 */
type Toggle = boolean | undefined;

export interface Options {
  // Feature toggles.
  typescript?: Toggle;
  vue?: Toggle;
  react?: Toggle;
  test?: Toggle;
  unocss?: Toggle;
  markdown?: Toggle;
  node?: Toggle;
  pnpm?: Toggle;
  regexp?: Toggle;
  /**
   * Prettier integration. `false` disables; `true` or `undefined` enables with defaults;
   * an options object enables and merges into Prettier defaults.
   */
  prettier?: boolean | PrettierOptions;

  // Project-wide settings.
  ignores?: string[];
  globals?: Linter.Globals;

  // Per-group rule overrides.
  rules?: RulesOverrides;
}
