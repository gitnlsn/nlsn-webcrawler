import { CrawledData } from "./CrawledData.interface"

export interface Crawler {
  crawlUrlPath: (url: string) => Promise<CrawledData>
}
