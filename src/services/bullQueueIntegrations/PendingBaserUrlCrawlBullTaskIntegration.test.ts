import { Queue } from "bull"
import { Redis } from "ioredis"
import { BullQueueFactory } from "../../bull/QueueFactory"
import {
  PendingBaseUrlCrawlTask,
  PendingBaseUrlCrawlTaskHandler,
  PendingBaseUrlProvider,
} from "../interfaces/PendingBaseUrlCrawlTask.interface"
import { PendingBaseUrlCrawlBullTaskIntegration } from "./PendingBaseUrlCrawlBullTaskIntegration"

const redisUrl = String(process.env.BULL_REDIS_URL)

class TestingTaskHandler implements PendingBaseUrlCrawlTaskHandler {
  run = jest.fn()
}

class TestingBaserUrlProvider implements PendingBaseUrlProvider {
  getPendingBaseUrlIds = jest.fn()
}

describe("BaseUrlCrawl Schedule and Consumption", () => {
  let redis: Redis
  let queue: Queue

  let taskHandler: PendingBaseUrlCrawlTaskHandler
  let baseUrlProvider: PendingBaseUrlProvider
  let bullTaskIntegration: PendingBaseUrlCrawlBullTaskIntegration

  beforeAll(() => {
    redis = new Redis(redisUrl)
    queue = BullQueueFactory.queue<PendingBaseUrlCrawlTask>("testing queue")
  })

  beforeEach(() => {
    taskHandler = new TestingTaskHandler()
    baseUrlProvider = new TestingBaserUrlProvider()
    bullTaskIntegration = new PendingBaseUrlCrawlBullTaskIntegration(
      queue,
      taskHandler,
      baseUrlProvider
    )
  })

  afterEach(async () => {
    await redis.flushall()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await queue.close()
    redis.disconnect()
  })

  it("should set process and schedule tasks", async () => {
    const taskHandlerPromise = new Promise<void>((resolve) => {
      ;(
        taskHandler.run as jest.MockedFunction<typeof taskHandler.run>
      ).mockImplementationOnce(async () => {
        resolve()
      })
    })

    ;(
      baseUrlProvider.getPendingBaseUrlIds as jest.MockedFunction<
        typeof baseUrlProvider.getPendingBaseUrlIds
      >
    ).mockResolvedValueOnce(["sample id"])

    bullTaskIntegration.setupConsumer()

    await bullTaskIntegration.schedule()

    await taskHandlerPromise

    expect(baseUrlProvider.getPendingBaseUrlIds).toHaveBeenCalledTimes(1)
    expect(taskHandler.run).toHaveBeenCalledTimes(1)
    expect(taskHandler.run).toHaveBeenCalledWith({ baseUrlId: "sample id" })
  })
})
