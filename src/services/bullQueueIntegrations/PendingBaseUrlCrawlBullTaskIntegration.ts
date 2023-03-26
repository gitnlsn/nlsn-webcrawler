import { Queue } from "bull"
import {
  PendingBaseUrlCrawlTask,
  PendingBaseUrlCrawlTaskHandler,
  PendingBaseUrlProvider,
} from "../interfaces/PendingBaseUrlCrawlTask.interface"
import { BullQueueIntegration } from "../interfaces/BullQueueIntegration.interface"

export class PendingBaseUrlCrawlBullTaskIntegration
  implements BullQueueIntegration
{
  constructor(
    private readonly queue: Queue<PendingBaseUrlCrawlTask>,
    private readonly taskHandler: PendingBaseUrlCrawlTaskHandler,
    private readonly pendingBaseUrlProvider: PendingBaseUrlProvider
  ) {}

  async setupConsumer() {
    return this.queue.process(30, async ({ data }, done) => {
      await this.taskHandler.run(data)
      done()
    })
  }

  async schedule() {
    const pendingBaseUrls =
      await this.pendingBaseUrlProvider.getPendingBaseUrlIds()

    if (pendingBaseUrls.length === 0) {
      console.warn("Missing pending baseUrls to schedule")
      return
    }

    return await Promise.all(
      pendingBaseUrls.map((baseUrlId) => this.queue.add({ baseUrlId }))
    )
  }
}
