import axios, { AxiosInstance } from "axios"
import { AxiosCrawler } from "./AxiosCrawler"

/**
 * Skipped because it depends on external services.
 */
describe.skip("AxiosCrawler", () => {
  let axiosInstance: AxiosInstance
  let axiosCrawler: AxiosCrawler

  beforeAll(async () => {
    axiosInstance = axios.create()
    axiosCrawler = new AxiosCrawler(axiosInstance)
  })

  it("should get final url", async () => {
    const crawlerData = await axiosCrawler.crawlUrlPath("https://google.com")

    expect(crawlerData.pageUrl).toBe("https://www.google.com/")
  })
})
