import { collapseVariantGroup, notNull, parseVariantGroup } from '@unocss/core';

export async function sortRules(rules, uno) {
  const unknown = [];

  // enable details for variant handlers
  if (!uno.config.details) { uno.config.details = true; }

  const expandedResult = parseVariantGroup(rules); // todo read seperators from config
  rules = expandedResult.expanded;

  const result = await Promise.all(rules.split(/\s+/g)
    .map(async (i) => {
      const token = await uno.parseToken(i);
      if (token == null) {
        unknown.push(i);
        return undefined;
      }
      const variantRank = (token[0][5]?.variantHandlers?.length || 0) * 100_000;
      const order = token[0][0] + variantRank;
      return [order, i];
    }));

  const sorted = result
    .filter(element => notNull(element))
    .sort((a, b) => {
      let result = a[0] - b[0];
      if (result === 0) { result = a[1].localeCompare(b[1]); }
      return result;
    })
    .map(i => i[1])
    .join(' ');

  // if (expandedResult?.prefixes.length) { sorted = collapseVariantGroup(sorted, expandedResult.prefixes); }

  return [...unknown, sorted].join(' ').trim();
}
