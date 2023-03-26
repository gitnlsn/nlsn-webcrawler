import { WebCrawlerRepository } from "../../repository/WebCrawlerRepository"
import { PendingBaseUrlProvider } from "../interfaces/PendingBaseUrlCrawlTask.interface"

/**
 * Adapts PendingBaseUrlProvider to WebCrawlerRepository interface
 */
export class SimplePendingBaseUrlProvider implements PendingBaseUrlProvider {
  constructor(private readonly repository: WebCrawlerRepository) {}

  getPendingBaseUrlIds = async () =>
    this.repository
      .getPendingBaseUrls()
      .then((baseUrl) => baseUrl.map((baseUrl) => baseUrl.value))
}
