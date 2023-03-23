import { Browser } from "puppeteer"
import { ArrayUtils } from "../utils/ArrayUtils"
import { CrawledData } from "./CrawledData.interface"
import { Crawler } from "./Crawler.interface"

export class PuppeteerCrawler implements Crawler {
  constructor(private readonly browser: Browser) {}

  async crawlUrlPath(urlPath: string): Promise<CrawledData> {
    const page = await this.browser.newPage()

    await page.goto(urlPath)

    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.href))
    const images = await page.$$eval("img[src]", (as) => as.map((a) => a.src))

    return {
      pageUrl: page.mainFrame().url(),
      internalPaths: ArrayUtils.uniqueStrings(
        hrefs.filter((link) => link.includes(urlPath))
      ),
      externalPaths: ArrayUtils.uniqueStrings(
        hrefs.filter((link) => !link.includes(urlPath))
      ),
      imageLinks: ArrayUtils.uniqueStrings(images),
    }
  }
}
