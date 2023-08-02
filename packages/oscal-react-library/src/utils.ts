export function groupBy<T, K extends PropertyKey>(list: T[], key: (item: T) => K): Record<K, T[]> {
  return list.reduce(
    (map, item) => {
      map[key(item)] ??= [];
      map[key(item)].push(item);
      return map;
    },
    {} as Record<K, T[]>
  );
}

export const colorFromString = (name: string): string => {
  // This implementation hashes the given string to create a
  // color string. This is based of the example algorithm given
  // in the MUI documentation and adapted to our use case.
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  // Add an alpha channe to prevent the color from being too dark
  return `${color}C0`;
};
