import { Redis } from "ioredis"
import { BullQueueFactory } from "../../bull/QueueFactory"
import { bullRedisUlr } from "../../config/envVars"
import { CronScheduler } from "./CronScheduler"

/**
 * Test is passing. Skipped because its hard to mock cron timer.
 */
describe.skip("CronScheduler", () => {
  let redis: Redis

  beforeAll(() => {
    redis = new Redis(bullRedisUlr)
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

    const cronScheduler = new CronScheduler(queue, "* * * * *", callback)

    cronScheduler.setupConsumer()
    await cronScheduler.schedule()

    await promise

    expect(callback).toHaveBeenCalledTimes(1)

    await queue.close()
  }, 60000)
})
