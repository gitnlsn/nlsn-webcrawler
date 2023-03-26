import Queue from "bull"

const redisUrl = String(process.env.BULL_REDIS_URL)

export class BullQueueFactory {
  /**
   * Encapsulates redisUrl with env variable and options.
   */
  static queue<T>(queueName: string) {
    return new Queue<T>(queueName, redisUrl)
  }
}
