import { PrismaClient } from "@prisma/client"
import { WebCrawlerRepository } from "./WebCrawlerRepository"

describe("WebCrawlerRepository", () => {
  let prisma: PrismaClient
  let webCrawlerRepository: WebCrawlerRepository

  beforeAll(async () => {
    prisma = new PrismaClient()
    webCrawlerRepository = new WebCrawlerRepository(prisma)
  })

  describe("baseUrl", () => {
    afterEach(async () => {
      await prisma.baseUrlInspection.deleteMany({})
      await prisma.baseUrl.deleteMany({})
    })

    describe("insert", () => {
      it("should insert base urls", async () => {
        const urls = ["www.google.com", "www.twilio.com", "duckduckgo.com"]

        await webCrawlerRepository.insertBaseUrls(urls)

        const baseUrls = await prisma.baseUrl.findMany({})

        expect(baseUrls.length).toBe(3)

        urls.forEach((url) => {
          expect(baseUrls).toContainEqual({
            id: expect.anything(),
            value: url,
            createdAt: expect.anything(),
          })
        })
      })

      it("should not insert the same url", async () => {
        await webCrawlerRepository.insertBaseUrls(["www.google.com"])
        await webCrawlerRepository.insertBaseUrls(["www.google.com"])

        const baseUrls = await prisma.baseUrl.findMany({})

        expect(baseUrls.length).toBe(1)
      })

      it("should return inserted baseUrls", async () => {
        const urls = ["www.google.com", "www.twilio.com", "duckduckgo.com"]

        await webCrawlerRepository.insertBaseUrls(urls)

        // Insert existing baseUrls
        const insertedBaseUrls = await webCrawlerRepository.insertBaseUrls(urls)

        expect(insertedBaseUrls.length).toBe(3)

        urls.forEach((url) => {
          expect(insertedBaseUrls).toContainEqual({
            id: expect.anything(),
            value: url,
            createdAt: expect.anything(),
          })
        })
      })
    })

    describe("getById", () => {
      it("should get", async () => {
        await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const insertedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.twillio.com" },
        })

        const baseUrlById = await webCrawlerRepository.getBaseUrlById(
          insertedBaseUrl.id
        )

        if (baseUrlById === null) {
          throw new Error("Expected baseUrl to exist")
        }

        expect(baseUrlById).toEqual(insertedBaseUrl)
      })
    })

    describe("getPendingBaseUrl", () => {
      it("should return baseUrl with no inspections", async () => {
        const insertedBaserUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const pendingBaseUrl = await webCrawlerRepository.getPendingBaseUrls()

        expect(pendingBaseUrl).toContainEqual({
          ...insertedBaserUrl,
          inspections: [],
        })
      })

      it("should return baseUrl with inspections", async () => {
        const insertedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const insertedInpection = await prisma.baseUrlInspection.create({
          data: { baseUrlId: insertedBaseUrl.id },
        })

        const pendingBaseUrl = await webCrawlerRepository.getPendingBaseUrls()

        expect(pendingBaseUrl).toContainEqual({
          ...insertedBaseUrl,
          inspections: [insertedInpection],
        })
      })

      it("should prioritize non inspected baseUrl", async () => {
        const notInspectedBaserUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const inspectedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.twillio.com" },
        })

        const insertedInpection = await prisma.baseUrlInspection.create({
          data: { baseUrlId: inspectedBaseUrl.id },
        })

        const pendingBaseUrls = await webCrawlerRepository.getPendingBaseUrls()

        expect(pendingBaseUrls).toHaveLength(2)

        expect(pendingBaseUrls[0]).toEqual({
          ...notInspectedBaserUrl,
          inspections: [],
        })

        expect(pendingBaseUrls[1]).toEqual({
          ...inspectedBaseUrl,
          inspections: [insertedInpection],
        })
      })
    })
  }) // end - baseUrl
})
