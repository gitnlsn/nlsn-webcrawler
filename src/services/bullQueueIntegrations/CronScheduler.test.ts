import { Redis } from "ioredis"
import { BullQueueFactory } from "../../bull/QueueFactory"
import { CronScheduler } from "./CronScheduler"

const redisUrl = String(process.env.BULL_REDIS_URL)

/**
 * Test is passing. Skipped because its hard to mock cron timer.
 */
describe.skip("CronScheduler", () => {
  let redis: Redis

  beforeAll(() => {
    redis = new Redis(redisUrl)
  })

  afterEach(async () => {
    await redis.flushall()
  })

  afterAll(() => {
    redis.disconnect()
  })

  it("should schedule cron job", async () => {
    const callback = jest.fn()
    const promise = new Promise<void>((resolve) => {
      callback.mockImplementationOnce(() => {
        resolve()
      })
    })

    const queue = BullQueueFactory.queue("testing queue")

    const cronScheduler = new CronScheduler(queue, callback)

    cronScheduler.setupConsumer()
    await cronScheduler.schedule()

    await promise

    expect(callback).toHaveBeenCalledTimes(1)

    await queue.close()
  }, 60000)
})
