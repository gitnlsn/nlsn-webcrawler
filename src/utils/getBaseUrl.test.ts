import { describe, it, expect } from "vitest"
import { getBaseUrl } from "./getBaseUrl"

describe("getBaseUrl", () => {
  it.each([
    ["https://www.google.com/search?q=foo", "www.google.com"],
    ["https://duckduckgo.com/?q=something", "duckduckgo.com"],
    [
      "https://www.thetimes.co.uk/article/boris-johnson-partygate-latest-news-rishi-sunak-jeremy-hunt-live-2023-bfc8xl7td",
      "www.thetimes.co.uk",
    ],
  ])("should getBaseUrl from %s", (url, baseUrl) => {
    expect(getBaseUrl(url)).toBe(baseUrl)
  })
})
