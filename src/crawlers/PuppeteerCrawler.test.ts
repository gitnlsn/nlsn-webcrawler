import puppeteer, { Browser } from "puppeteer"
import { PuppeteerCrawler } from "./PuppeteerCrawler"

describe.skip("PuppeteerCrawler", () => {
  let browser: Browser
  let puppeteerCrawler: PuppeteerCrawler

  beforeAll(async () => {
    browser = await puppeteer.launch()
    puppeteerCrawler = new PuppeteerCrawler(browser)
  })

  afterAll(async () => {
    await browser.close()
  })

  it("should get final url path from browser navigation", async () => {
    const crawledData = await puppeteerCrawler.crawlUrlPath('https://google.com')
    
    expect(crawledData.pageUrl).toBe('https://www.google.com/')
  })
})
