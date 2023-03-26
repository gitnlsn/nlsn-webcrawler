import Queue from "bull"
import {
  baseUrlQueueName,
  bullRedisUlr,
  cronScheduleQueueName,
} from "../config/envVars"
import { PendingBaseUrlCrawlTask } from "../services/interfaces/PendingBaseUrlCrawlTask.interface"

export class BullQueueFactory {
  /**
   * Encapsulates redisUrl with env variable and options.
   */
  static queue<T>(queueName: string) {
    return new Queue<T>(queueName, bullRedisUlr)
  }

  static baseUrlQueue() {
    return BullQueueFactory.queue<PendingBaseUrlCrawlTask>(baseUrlQueueName)
  }

  static cronScheduleQueue() {
    return BullQueueFactory.queue<void>(cronScheduleQueueName)
  }
}
