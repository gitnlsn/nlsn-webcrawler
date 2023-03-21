import { PrismaClient } from "@prisma/client"
import { GetFileUrlsProps } from "./GetFileUrls.interface"
import { InsertPathWithFilesProps } from "./InsertPathWithfiles.interface"

export class WebCrawlerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getBaseUrlById(id: string) {
    return this.prisma.baseUrl.findFirst({
      where: { id },
    })
  }

  async insertBaseUrls(urls: string[]) {
    return this.prisma.$transaction(async (transaction) => {
      const existingBaseUrls = await transaction.baseUrl.findMany({
        where: { value: { in: urls } },
      })

      return transaction.baseUrl.createMany({
        data: urls
          .filter(
            (url) =>
              existingBaseUrls.find(
                (existingBaseUrl) => existingBaseUrl.value === url
              ) === undefined
          )
          .map((url) => ({
            value: url,
          })),
      })
    })
  }

  async insertBaseUrlInspection(baseUrlId: string) {
    return this.prisma.baseUrlInspection.create({
      data: { baseUrlId },
      include: {
        baseUrl: true,
      },
    })
  }

  async getPendingBaseUrls() {
    const urls = await this.prisma.baseUrl.findMany({
      orderBy: {
        inspections: {
          _count: "asc",
        },
      },
      include: {
        inspections: {
          orderBy: {
            inspectedAt: "desc",
          },
        },
      },
      take: 20,
    })

    // Prioritizes base urls based on previous inspections and createdAt
    return urls.sort((left, right) => {
      if (left.inspections.length !== right.inspections.length) {
        return left.inspections.length - right.inspections.length
      }

      if (left.inspections.length === 0 && right.inspections.length === 0) {
        return left.createdAt.getTime() - right.createdAt.getTime()
      }

      return (
        left.inspections[0].inspectedAt.getTime() -
        right.inspections[0].inspectedAt.getTime()
      )
    })
  }

  async upsertPathWithFiles({
    baseUrlId,
    data: { urlPath, fileUrls },
  }: InsertPathWithFilesProps) {
    return this.prisma.urlPath.upsert({
      create: {
        baseUrlId,
        value: urlPath,
        fileUrls: {
          createMany: {
            data: fileUrls.map((fileUrl) => ({
              value: fileUrl,
            })),
          },
        },
        urlPathInspection: {
          create: {},
        },
      },
      update: {
        fileUrls: {
          deleteMany: {},
          createMany: {
            data: fileUrls.map((fileUrl) => ({
              value: fileUrl,
            })),
          },
        },
        urlPathInspection: {
          create: {},
        },
      },
      where: { value: urlPath },
      include: {
        baseUrl: true,
        fileUrls: true,
      },
    })
  }

  async insertUrlPaths(baseUrlId: string, urlPaths: string[]) {
    return this.prisma.$transaction(async (transaction) => {
      const existingUrlPaths = await transaction.urlPath.findMany({
        where: { value: { in: urlPaths } },
      })

      return transaction.urlPath.createMany({
        data: urlPaths
          .filter(
            (url) =>
              existingUrlPaths.find(
                (existingUrlPath) => existingUrlPath.value === url
              ) === undefined
          )
          .map((url) => ({
            value: url,
            baseUrlId,
          })),
      })
    })
  }

  async getFileUrls({ baseUrl, urlPath }: GetFileUrlsProps) {
    return this.prisma.fileUrl.findMany({
      where: {
        urlPath: {
          value: urlPath,
          baseUrl: { value: baseUrl },
        },
      },
    })
  }
}
