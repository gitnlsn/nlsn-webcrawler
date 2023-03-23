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
    await prisma.urlPathInspection.deleteMany({})
    await prisma.urlPath.deleteMany({})
    await prisma.baseUrl.deleteMany({})
  })

  describe("UrlPath", () => {
    describe("upsert", () => {
      it("should insert new UrlPath with filePaths", async () => {
        const insertedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const urlPath = "https://www.google.com/search?q=foo"

        const fileUrls = [
          "https://veja.abril.com.br/wp-content/uploads/2021/02/FOOFIGHTERS-PRESS-SONY-MUSIC-1.jpg.jpg?quality=70&strip=info&w=680&h=453&crop=1",
          "https://s2.glbimg.com/dYmSE8cojPnzWNkDEH7t6r5Z9Ao=/0x0:3600x2699/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2017/5/u/0gs5gfQtGeZTibFaAo1w/foo-fighters.jpg",
        ]

        const insertedUrlPath = await webCrawlerRepository.upsertPathWithFiles({
          baseUrlId: insertedBaseUrl.id,
          data: {
            urlPath,
            fileUrls,
          },
        })

        expect(insertedUrlPath).toEqual({
          id: expect.anything(),
          value: urlPath,
          baseUrlId: insertedBaseUrl.id,
          baseUrl: insertedBaseUrl,
          fileUrls: fileUrls.map((url) => ({
            id: expect.anything(),
            value: url,
            urlPathId: expect.anything(),
          })),
          urlPathInspections: expect.anything(),
        })

        expect(insertedUrlPath.urlPathInspections.length).toBe(1)
      })

      it("should update existing urlPaht", async () => {
        const insertedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const urlPath = "https://www.google.com/search?q=foo"

        const fileUrls = [
          "https://veja.abril.com.br/wp-content/uploads/2021/02/FOOFIGHTERS-PRESS-SONY-MUSIC-1.jpg.jpg?quality=70&strip=info&w=680&h=453&crop=1",
          "https://s2.glbimg.com/dYmSE8cojPnzWNkDEH7t6r5Z9Ao=/0x0:3600x2699/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2017/5/u/0gs5gfQtGeZTibFaAo1w/foo-fighters.jpg",
        ]

        const insertedUrlPath = await webCrawlerRepository.upsertPathWithFiles({
          baseUrlId: insertedBaseUrl.id,
          data: {
            urlPath,
            fileUrls: [],
          },
        })

        expect(insertedUrlPath.urlPathInspections.length).toBe(1)

        const updatedUrlPath = await webCrawlerRepository.upsertPathWithFiles({
          baseUrlId: insertedBaseUrl.id,
          data: {
            urlPath,
            fileUrls,
          },
        })

        expect(updatedUrlPath).toEqual({
          id: expect.anything(),
          value: urlPath,
          baseUrlId: insertedBaseUrl.id,
          baseUrl: insertedBaseUrl,
          fileUrls: fileUrls.map((url) => ({
            id: expect.anything(),
            value: url,
            urlPathId: expect.anything(),
          })),
          urlPathInspections: expect.anything(),
        })

        expect(updatedUrlPath.urlPathInspections.length).toBe(2)
      })
    }) // end - describe upsert

    describe("insert urlPaths", () => {
      it("should insert new UrlPaths", async () => {
        const insertedBaseUrl = await prisma.baseUrl.create({
          data: { value: "www.google.com" },
        })

        const urlPaths = [
          "https://www.guitarworld.com/features/joe-walsh-taylor-hawkins-foo-fighters-solo",
          "https://www.billboard.com/music/rock/foo-fighters-pinball-machine-designer-talks-band-input-aliens-1235289577/",
        ]

        await webCrawlerRepository.insertUrlPaths(
          insertedBaseUrl.id,
          urlPaths
        )

        // Insert existing UrlPaths
        const insertedUrlPaths = await webCrawlerRepository.insertUrlPaths(
          insertedBaseUrl.id,
          urlPaths
        )

        expect(insertedUrlPaths).toHaveLength(2)

        urlPaths.forEach((url) => {
          expect(insertedUrlPaths).toContainEqual({
            id: expect.anything(),
            value: url,
            baseUrlId: insertedBaseUrl.id,
          })
        })
      })
    }) // end - describe insert UrlPaths
  }) // end - describe UrlPaths
})
