import axios, { AxiosInstance } from "axios"
import puppeteer, { Browser } from "puppeteer"
import { PuppeteerCrawler } from "./PuppeteerCrawler"

describe("PuppeteerCrawler", () => {
  let browser: Browser
  let axiosInstance: AxiosInstance
  let puppeteerCrawler: PuppeteerCrawler

  beforeAll(async () => {
    browser = await puppeteer.launch()
    axiosInstance = axios.create()
    puppeteerCrawler = new PuppeteerCrawler(browser, axiosInstance)
  })

  afterAll(async () => {
    await browser.close()
  })

  it("should get final url path from browser navigation", async () => {
    const crawledData = await puppeteerCrawler.crawlUrlPath(
      "https://google.com"
    )

    expect(crawledData.pageUrl).toBe("https://www.google.com/")
  })
})
