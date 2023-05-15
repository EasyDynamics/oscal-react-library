import * as util from "./utils";

describe("groupBy", () => {
  test("empty list yields an empty object", () => {
    expect(util.groupBy([], (item: any) => item.bar)).toEqual({});
  });
  test("items are grouped by key", () => {
    type Item = { count: number; name: string };
    const items: Item[] = [
      { count: 1, name: "a" },
      { count: 1, name: "b" },
      { count: 1, name: "c" },
      { count: 2, name: "d" },
      { count: 3, name: "e" },
      { count: 3, name: "f" },
    ];
    expect(util.groupBy(items, (item) => item.count)).toEqual({
      1: [items[0], items[1], items[2]],
      2: [items[3]],
      3: [items[4], items[5]],
    });
  });
});
