import { PrismaClient } from "@prisma/client"
import { WebCrawlerRepository } from "./WebCrawlerRepository"

describe("WebCrawlerRepository", () => {
  let prisma: PrismaClient
  let webCrawlerRepository: WebCrawlerRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    webCrawlerRepository = new WebCrawlerRepository(prisma)
  })

  afterEach(async () => {
    await prisma.fileUrl.deleteMany({})
    await prisma.urlPath.deleteMany({})
    await prisma.baseUrl.deleteMany({})
  })

  describe("FileUrl", () => {
    it("should return empty array if none", async () => {
      const files = await webCrawlerRepository.getFileUrls({})

      expect(files).toEqual([])
    })

    it("should get files by baseUrl", async () => {
      const insertedBaseUrl = await prisma.baseUrl.create({
        data: { value: "www.google.com" },
      })

      const insertedUrlPath = await prisma.urlPath.create({
        data: {
          baseUrlId: insertedBaseUrl.id,
          value:
            "https://www.guitarworld.com/features/joe-walsh-taylor-hawkins-foo-fighters-solo",
        },
      })

      const insertedFileUrls = await prisma.fileUrl.create({
        data: {
          urlPathId: insertedUrlPath.id,
          value:
            "https://cdn.mos.cms.futurecdn.net/pnj5VARx6zwfkcdeRSY8pa-970-80.jpg.webp",
        },
      })

      const files = await webCrawlerRepository.getFileUrls({
        baseUrl: insertedBaseUrl.value,
      })

      expect(files).toHaveLength(1)
      expect(files).toContainEqual(insertedFileUrls)
    })

    it("should get files by UrlPath", async () => {
      const insertedBaseUrl = await prisma.baseUrl.create({
        data: { value: "www.google.com" },
      })

      const insertedUrlPath = await prisma.urlPath.create({
        data: {
          baseUrlId: insertedBaseUrl.id,
          value:
            "https://www.guitarworld.com/features/joe-walsh-taylor-hawkins-foo-fighters-solo",
        },
      })

      const insertedFileUrls = await prisma.fileUrl.create({
        data: {
          urlPathId: insertedUrlPath.id,
          value:
            "https://cdn.mos.cms.futurecdn.net/pnj5VARx6zwfkcdeRSY8pa-970-80.jpg.webp",
        },
      })

      const files = await webCrawlerRepository.getFileUrls({
        urlPath: insertedUrlPath.value,
      })

      expect(files).toHaveLength(1)
      expect(files).toContainEqual(insertedFileUrls)
    })
  }) // end - describe FileUrl
})
