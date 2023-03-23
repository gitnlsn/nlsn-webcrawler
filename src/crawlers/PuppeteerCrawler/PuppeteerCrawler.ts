import { AxiosInstance } from "axios"
import { Browser, Page } from "puppeteer"
import { ArrayUtils } from "../../utils/ArrayUtils"
import {
  getContentType,
  getContentTypeFromRecord,
} from "../../utils/getContentType"
import { getUrlOrigin } from "../../utils/getUrlOrigin"
import { isAbsoluteUrlPath } from "../../utils/UrlRegex"
import { CrawledData } from "../CrawledData.interface"
import { Crawler } from "../Crawler.interface"

export class PuppeteerCrawler implements Crawler {
  constructor(private readonly browser: Browser) {}

  async crawlUrlPath(urlPath: string): Promise<CrawledData> {
    const page = await this.browser.newPage()

    const response = await page.goto(urlPath)

    if (!response) {
      throw new Error("Expected response to exist")
    }

    const contentType = getContentTypeFromRecord(response.headers())
    if (!contentType || !contentType.includes("text/html")) {
      throw new Error("Expected content-type to be text/html")
    }

    const pageUrl = response.url()
    const origin = getUrlOrigin(pageUrl)

    // Final Links
    const anchorLinks: string[] = []
    const imageLinks: string[] = []

    const asyncTasks: Array<Promise<unknown>> = []

    const anchorHrefs = await page.$$eval("a[href]", (as) =>
      as.map((a) => a.href)
    )
    const imageSrcs = await page.$$eval("img[src]", (as) =>
      as.map((a) => a.src)
    )

    // Handling anchor links
    anchorHrefs.forEach((link) => {
      const path = link
      const absolutePath = isAbsoluteUrlPath(path) ? path : `${origin}${path}`
      let anchorNewPage: Page

      const testingLinkPromise = this.browser
        .newPage()
        .then((page) => {
          anchorNewPage = page
          return page.goto(absolutePath)
        })
        .then((response) => {
          if (!response) {
            throw new Error("Expected response to exist")
          }

          const anchorContentType = getContentTypeFromRecord(response.headers())
          if (!anchorContentType) {
            throw new Error("Expected content-type to exist")
          }

          const testingLinkUrl = response.url()
          if (anchorContentType.includes("image")) {
            imageLinks.push(testingLinkUrl)
          } else {
            anchorLinks.push(testingLinkUrl)
          }
        })
        .catch(console.error)
        .finally(() => anchorNewPage.close())

      asyncTasks.push(testingLinkPromise)
    })

    // Handling image links
    imageSrcs.forEach((link) => {
      const path = link
      const absolutePath = isAbsoluteUrlPath(path) ? path : `${origin}${path}`

      imageLinks.push(absolutePath)
    })

    await Promise.all(asyncTasks)

    return {
      pageUrl,
      internalPaths: ArrayUtils.uniqueStrings(
        anchorLinks.filter((link) => link.includes(pageUrl))
      ),
      externalPaths: ArrayUtils.uniqueStrings(
        anchorLinks.filter((link) => !link.includes(pageUrl))
      ),
      imageLinks: ArrayUtils.uniqueStrings(imageLinks),
    }
  }
}
