import { describe, it, expect } from "vitest"
import { ArrayUtils } from "./ArrayUtils"

describe("ArrayUtils", () => {
  it.each([
    [[], []],
    [["1"], ["1"]],
    [["1", "1"], ["1"]],
    [
      ["1", "2"],
      ["1", "2"],
    ],
    [
      ["1", "2", "1"],
      ["1", "2"],
    ],
  ])("should parse unique strings array %s -> %s", (input, expected) => {
    expect(ArrayUtils.uniqueStrings(input)).toEqual(expected)
  })
})
