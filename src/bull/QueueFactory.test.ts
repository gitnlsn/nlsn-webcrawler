import { Redis } from "ioredis"
import { bullRedisUlr } from "../config/envVars"
import { BullQueueFactory } from "./QueueFactory"

describe("QueueFactory", () => {
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

  it("should provide queue", async () => {
    const queue = BullQueueFactory.queue("testing queue")

    expect(queue).toBeTruthy()
    await queue.close()
  })

  it("should provide working queue", async () => {
    interface QueueData {
      id: string
    }
    const queue = BullQueueFactory.queue<QueueData>("testing queue")

    const mockedHandler = jest.fn()

    const promise = new Promise<void>((resolve) => {
      mockedHandler.mockImplementationOnce(() => {
        resolve()
      })
    })

    queue.process(mockedHandler).catch(console.error)

    await queue.add({ id: "some id" })

    await promise

    expect(mockedHandler).toHaveBeenCalledTimes(1)
    expect(mockedHandler).toHaveBeenCalledWith(
      expect.objectContaining({ data: { id: "some id" } })
    )

    await queue.close()
  })
})
