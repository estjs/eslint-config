export function notNull(value) {
  return value != null;
}
export function collapseVariantGroup(str, prefixes) {
  const collection = new Map();
  const sortedPrefix = prefixes.sort((a, b) => b.length - a.length);
  return str
    .split(/\s+/g)
    .map((part) => {
      const prefix = sortedPrefix.find((prefix2) => part.startsWith(prefix2));
      if (!prefix) {
        return part;
      }
      const body = part.slice(prefix.length);
      if (collection.has(prefix)) {
        collection.get(prefix).push(body);
        return null;
      } else {
        const items = [body];
        collection.set(prefix, items);
        return {
          prefix,
          items,
        };
      }
    })
    .filter((element) => notNull(element))
    .map((i) => {
      if (typeof i === 'string') {
        return i;
      }
      return `${i.prefix}(${i.items.join(' ')})`;
    })
    .join(' ');
}
