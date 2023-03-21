import { PrismaClient } from "@prisma/client"
import puppeteer, { Browser } from "puppeteer"
import { PuppeteerCrawler } from "../crawlers/PuppeteerCrawler"
import { WebCrawlerRepository } from "../repository/WebCrawlerRepository"
import { CrawlBaseUrlService } from "../services/CrawlBaseUrlService"

export class MainModule {
  private prismaClient: PrismaClient | undefined
  private webCrawlerRepository: WebCrawlerRepository | undefined

  private browser: Browser | undefined
  private puppeteerCrawler: PuppeteerCrawler | undefined

  private CrawlBaseUrlService: CrawlBaseUrlService | undefined

  async init() {
    this.prismaClient = new PrismaClient()
    this.webCrawlerRepository = new WebCrawlerRepository(this.prismaClient)

    this.browser = await puppeteer.launch()
    this.puppeteerCrawler = new PuppeteerCrawler(this.browser)

    this.CrawlBaseUrlService = new CrawlBaseUrlService(
      this.webCrawlerRepository,
      this.puppeteerCrawler
    )
  }
}
