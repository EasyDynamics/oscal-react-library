export function groupBy<T, K extends PropertyKey>(list: T[], key: (item: T) => K): Record<K, T[]> {
  return list.reduce((map, item) => {
    map[key(item)] ??= [];
    map[key(item)].push(item);
    return map;
  }, {} as Record<K, T[]>);
}
