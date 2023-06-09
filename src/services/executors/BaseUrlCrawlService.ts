import { PuppeteerCrawler } from "../../crawlers/PuppeteerCrawler/PuppeteerCrawler"
import { WebCrawlerRepository } from "../../repository/WebCrawlerRepository"
import { getBaseUrl } from "../../utils/getBaseUrl"
import {
  PendingBaseUrlCrawlTask,
  PendingBaseUrlCrawlTaskHandler,
} from "../interfaces/PendingBaseUrlCrawlTask.interface"

export class BaseUrlCrawlService implements PendingBaseUrlCrawlTaskHandler {
  constructor(
    private readonly prisma: WebCrawlerRepository,
    private readonly crawler: PuppeteerCrawler
  ) {}

  async run({ baseUrlId }: PendingBaseUrlCrawlTask) {
    const baseUrl = await this.prisma.getBaseUrlById(baseUrlId)

    if (baseUrl === null) {
      console.warn("Expected base url to exist. Terminating service execution.")
      return
    }

    const crawledData = await this.crawler.crawlUrlPath(baseUrl.value)

    const externalBaseUrls = crawledData.externalPaths.map((path) =>
      getBaseUrl(path)
    )

    await this.prisma.insertBaseUrls(externalBaseUrls)

    await this.prisma.upsertPathWithFiles({
      baseUrlId: baseUrl.id,
      data: {
        urlPath: crawledData.pageUrl,
        fileUrls: crawledData.imageLinks,
      },
    })

    await this.prisma.insertUrlPaths(baseUrl.id, crawledData.internalPaths)

    await this.prisma.insertBaseUrlInspection(baseUrl.id)
  }
}
