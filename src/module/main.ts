import { PrismaClient } from "@prisma/client"
import { Queue } from "bull"
import puppeteer, { Browser } from "puppeteer"
import { BullQueueFactory } from "../bull/QueueFactory"
import { PuppeteerCrawler } from "../crawlers/PuppeteerCrawler/PuppeteerCrawler"
import { WebCrawlerRepository } from "../repository/WebCrawlerRepository"
import { SimplePendingBaseUrlProvider } from "../services/adapters/SimplePendingBaseUrlProvider"
import { CronScheduler } from "../services/bullQueueIntegrations/CronScheduler"
import { PendingBaseUrlCrawlBullTaskIntegration } from "../services/bullQueueIntegrations/PendingBaseUrlCrawlBullTaskIntegration"
import { BaseUrlCrawlService } from "../services/executors/BaseUrlCrawlService"
import { PendingBaseUrlCrawlTask } from "../services/interfaces/PendingBaseUrlCrawlTask.interface"

export class MainModule {
  constructor(
    private readonly pendingBaseUrlCrawlQueue: Queue<PendingBaseUrlCrawlTask>,
    private readonly cronScheduleCrawlQueue: Queue<void>,

    private readonly prismaClient: PrismaClient,
    private readonly webCrawlerRepository: WebCrawlerRepository,

    private readonly browser: Browser,
    private readonly puppeteerCrawler: PuppeteerCrawler,

    private readonly baseUrlCrawlService: BaseUrlCrawlService,

    private readonly pendingBaseUrlCrawlBullTaskIntegration: PendingBaseUrlCrawlBullTaskIntegration,
    private readonly cronScheduler: CronScheduler
  ) {}

  static async create() {
    const pendingBaseUrlCrawlQueue = BullQueueFactory.baseUrlQueue()
    const cronScheduleQueue = BullQueueFactory.cronScheduleQueue()

    const prismaClient = new PrismaClient()
    const webCrawlerRepository = new WebCrawlerRepository(prismaClient)

    const browser = await puppeteer.launch()
    const puppeteerCrawler = new PuppeteerCrawler(browser)

    const baseUrlCrawlService = new BaseUrlCrawlService(
      webCrawlerRepository,
      puppeteerCrawler
    )

    const simplePendingUrlProvider = new SimplePendingBaseUrlProvider(
      webCrawlerRepository
    )

    const pendingBaseUrlCrawlBullTaskIntegration =
      new PendingBaseUrlCrawlBullTaskIntegration(
        pendingBaseUrlCrawlQueue,
        baseUrlCrawlService,
        simplePendingUrlProvider
      )

    const cronScheduler = new CronScheduler(
      cronScheduleQueue,
      "* * * * *",
      () => pendingBaseUrlCrawlBullTaskIntegration.schedule()
    )

    return new MainModule(
      pendingBaseUrlCrawlQueue,
      cronScheduleQueue,

      prismaClient,
      webCrawlerRepository,

      browser,
      puppeteerCrawler,

      baseUrlCrawlService,

      pendingBaseUrlCrawlBullTaskIntegration,
      cronScheduler
    )
  }

  async scheduleCronJobs() {
    return this.cronScheduler.schedule()
  }
}
