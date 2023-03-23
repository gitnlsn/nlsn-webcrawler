import { isAbsoluteUrlPath, isRelativeUrlPath } from "./UrlRegex"

describe("isAbsoluteUrlPath", () => {
  it.each([
    ["https://www.google.com/services/"],
    ["https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2"],
    [
      "https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com",
    ],
    [
      "https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral",
    ],
    [
      "https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpbfooter",
    ],
    [
      "https://www.google.com/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpbfooter&fg=1",
    ],
  ])("should accept %s", (urlPath) => {
    expect(isAbsoluteUrlPath(urlPath)).toBe(true)
  })
})

describe("isRelativeUrlPath", () => {
  it.each([
    ["/services/"],
    ["/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2"],
    ["/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com"],
    [
      "/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral",
    ],
    [
      "/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpbfooter",
    ],
    [
      "/services/?subid=ww-ww-et-g-awa-a-g_hpbfoot1_1!o2&utm_source=google.com&utm_medium=referral&utm_campaign=google_hpbfooter&fg=1",
    ],
  ])("should accept %s", (urlPath) => {
    expect(isRelativeUrlPath(urlPath)).toBe(true)
  })
})
