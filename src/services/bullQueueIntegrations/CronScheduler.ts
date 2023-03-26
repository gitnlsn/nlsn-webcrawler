import { Job, Queue } from "bull"
import { BullQueueIntegration } from "../interfaces/BullQueueIntegration.interface"

export class CronScheduler<T = unknown> implements BullQueueIntegration {
  constructor(
    private readonly queue: Queue,
    private readonly cronRule: string,
    private readonly callback: () => Promise<T>
  ) {}

  setupConsumer: () => Promise<void> = () => {
    return this.queue.process(async () => {
      await this.callback()
    })
  }

  schedule: () => Promise<Job<any> | Job<any>[] | undefined> = () => {
    return this.queue.add({}, { repeat: { cron: this.cronRule } })
  }
}
