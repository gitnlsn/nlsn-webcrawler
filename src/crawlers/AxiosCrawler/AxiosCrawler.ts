import { AxiosInstance } from "axios"
import { JSDOM } from "jsdom"

import { CrawledData } from "../CrawledData.interface"
import { Crawler } from "../Crawler.interface"
import { isAbsoluteUrlPath } from "../../utils/UrlRegex"
import { getUrlOrigin } from "../../utils/getUrlOrigin"
import { getContentType } from "../../utils/getContentType"
import { ArrayUtils } from "../../utils/ArrayUtils"

export class AxiosCrawler implements Crawler {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  async crawlUrlPath(urlPath: string): Promise<CrawledData> {
    const response = await this.axiosInstance.get(urlPath)

    const contentType = getContentType(response.headers)
    if (!contentType.includes("text/html")) {
      throw new Error("Expected content-type to be text/html")
    }

    const pageUrl = response.request.res.responseUrl
    const origin = getUrlOrigin(pageUrl)

    // Final Links
    const anchorLinks: string[] = []
    const imageLinks: string[] = []

    const asyncTasks: Array<Promise<unknown>> = []

    const dom = new JSDOM(response.data)
    const anchors = dom.window.document.getElementsByTagName("a")
    const images = dom.window.document.getElementsByTagName("img")

    // Handling anchor links
    for (let index = 0; index < anchors.length; index++) {
      const anchorElement = anchors.item(index)
      if (!anchorElement) {
        continue
      }

      const path = anchorElement.href
      const absolutePath = isAbsoluteUrlPath(path) ? path : `${origin}${path}`

      const testingLinkPromise = this.axiosInstance
        .get(absolutePath)
        .then((testingLinkRequest) => {
          const testingLinkUrl = testingLinkRequest.request.res.responseUrl
          if (getContentType(testingLinkRequest.headers).includes("image")) {
            imageLinks.push(testingLinkUrl)
          } else {
            anchorLinks.push(testingLinkUrl)
          }
        })

      asyncTasks.push(testingLinkPromise)
    }

    // Handling image links
    for (let index = 0; index < images.length; index++) {
      const imageElement = images.item(index)
      if (!imageElement) {
        continue
      }

      const path = imageElement.src
      const absolutePath = isAbsoluteUrlPath(path) ? path : `${origin}${path}`

      imageLinks.push(absolutePath)
    }

    await Promise.all(asyncTasks)

    return {
      pageUrl,
      externalPaths: ArrayUtils.uniqueStrings(
        anchorLinks.filter((link) => !link.includes(origin))
      ),
      internalPaths: ArrayUtils.uniqueStrings(
        anchorLinks.filter((link) => link.includes(origin))
      ),
      imageLinks: ArrayUtils.uniqueStrings(imageLinks),
    }
  }
}
