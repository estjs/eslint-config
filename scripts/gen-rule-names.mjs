// @ts-check
/**
 * Regenerate src/rule-names.ts from the rule registries exposed by every plugin we ship.
 *
 *   pnpm typegen
 *
 * The output is checked in so consumers don't pay for a build step. CI / prepublish runs
 * `pnpm verify-rule-names` (scripts/check-rule-names.mjs) and fails when a plugin version
 * bump has silently desynced the type union from the regenerated content.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { builtinRules } from 'eslint/use-at-your-own-risk';
// `builtinRules` is the only stable way to enumerate ESLint's core rule names; the
// deprecation warning is upstream's "use-at-your-own-risk" labelling, not an actual removal.

import * as eslintCommentsRaw from '@eslint-community/eslint-plugin-eslint-comments';
import * as eslintReactRaw from '@eslint-react/eslint-plugin';
import * as typescriptPluginRaw from '@typescript-eslint/eslint-plugin';
import * as unocssRaw from '@unocss/eslint-plugin';
import vitestRaw from '@vitest/eslint-plugin';
import commandRaw from 'eslint-plugin-command';
import * as importRaw from 'eslint-plugin-import-x';
import jsdocRaw from 'eslint-plugin-jsdoc';
import * as jsoncRaw from 'eslint-plugin-jsonc';
import * as pnpmRaw from 'eslint-plugin-pnpm';
import * as regexpRaw from 'eslint-plugin-regexp';
import * as unicornRaw from 'eslint-plugin-unicorn';
import unusedImportsRaw from 'eslint-plugin-unused-imports';
import * as vueRaw from 'eslint-plugin-vue';
import * as ymlRaw from 'eslint-plugin-yml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../src/rule-names.ts');

/**
 * @template T
 * @param {T | { default: T }} m
 * @returns {any}
 */
function interop(m) {
  return m && typeof m === 'object' && 'default' in m && m.default ? m.default : m;
}

const coreRules = Object.fromEntries(
  Array.from(builtinRules.keys(), (name) => [name, true]),
);

/**
 * Map of `TypeName -> rules object`. Order here is the order in which the unions are emitted,
 * keep it alphabetical for stable diffs.
 */
const ruleSources = {
  CommandRuleName: interop(commandRaw).rules,
  CommentsRuleName: interop(eslintCommentsRaw).rules,
  CoreRuleName: coreRules,
  ImportRuleName: interop(importRaw).rules,
  JSDocRuleName: interop(jsdocRaw).rules,
  JsoncRuleName: interop(jsoncRaw).rules,
  PnpmRuleName: interop(pnpmRaw).rules,
  ReactRuleName: interop(eslintReactRaw).rules,
  RegexpRuleName: interop(regexpRaw).rules,
  TypeScriptRuleName: interop(typescriptPluginRaw).rules,
  UnicornRuleName: interop(unicornRaw).rules,
  UnocssRuleName: interop(unocssRaw).rules,
  UnusedImportsRuleName: interop(unusedImportsRaw).rules,
  VitestRuleName: interop(vitestRaw).rules,
  VueRuleName: interop(vueRaw).rules,
  YmlRuleName: interop(ymlRaw).rules,
};

/** @param {string} value */
function quote(value) {
  return `'${String(value).replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

/** @param {string} typeName @param {Record<string, unknown> | undefined} rules */
function emitUnion(typeName, rules) {
  const names = Object.keys(rules ?? {}).sort((a, b) => a.localeCompare(b));
  if (names.length === 0) return `export type ${typeName} = never;`;
  return `export type ${typeName} =\n${names.map((name) => `  | ${quote(name)}`).join('\n')};`;
}

const header = [
  '// AUTO-GENERATED — do not edit.',
  '// Regenerate with: pnpm typegen',
  '',
];

const body = Object.entries(ruleSources).map(([typeName, rules]) => emitUnion(typeName, rules));

await writeFile(outputPath, [...header, ...body, ''].join('\n'));

console.log(`✓ wrote ${outputPath}`);
