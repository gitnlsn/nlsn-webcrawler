import { getUrlOrigin } from "./getUrlOrigin"

describe("getUrlOrigin", () => {
  it.each([
    ["https://www.google.com", "https://www.google.com"],
    ["http://www.google.com", "http://www.google.com"],
    ["http://www.google.com/search?q=foo", "http://www.google.com"],
  ])("should return protocol: %s -> %s", (url, expected) => {
    expect(getUrlOrigin(url)).toBe(expected)
  })
})
