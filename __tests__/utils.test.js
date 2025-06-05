const { convertTimestampToDate } = require("../db/seeds/utils");
const { createLookupObj } = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createLookupObj", () => {
  test("returns an empty object when passed an empty array", () => {
    expect(createLookupObj([], "key", "value")).toEqual({});
  });
  test("returns correct key-value mapping with one object", () => {
    const input = [{ category_id: 1, category_name: "crisps" }];
    const expected = { crisps: 1 };
    const actual = createLookupObj(input, "category_name", "category_id");
    expect(actual).toEqual(expected);
  });
  test("returns correct key-value mapping with multiple objects", () => {
    const input = [
      { category_id: 1, category_name: "crisps" },
      { category_id: 2, category_name: "pastry" },
      { category_id: 3, category_name: "biscuits" },
      { category_id: 4, category_name: "cake" },
    ];
    const expected = {
      crisps: 1,
      pastry: 2,
      biscuits: 3,
      cake: 4,
    };
    const actual = createLookupObj(input, "category_name", "category_id");
    expect(actual).toEqual(expected);
  });
  test("does not mutate original array", () => {
    const input = [{ category_id: 1, category_name: "crisps" }];
    const copyOfInput = [{ category_id: 1, category_name: "crisps" }];
    createLookupObj(input, "category_name", "category_id");
    expect(input).toEqual(copyOfInput);
  });
});
