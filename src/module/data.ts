import { PrismaClient } from "@prisma/client"
import { WebCrawlerRepository } from "../repository/WebCrawlerRepository"

export class DataModule {
  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly webCrawlerRepository: WebCrawlerRepository
  ) {}

  static async create() {
    const prismaClient = new PrismaClient()
    const webCrawlerRepository = new WebCrawlerRepository(prismaClient)

    return new DataModule(prismaClient, webCrawlerRepository)
  }

  async insertBaseUlrs(urls: string[]) {
    return this.webCrawlerRepository.insertBaseUrls(urls)
  }
}
