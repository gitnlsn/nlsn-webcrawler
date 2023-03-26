import Bull from "bull"

export interface BullQueueIntegration {
  setupConsumer: () => Promise<void>
  schedule: () => Promise<Bull.Job | Bull.Job[] | undefined>
}
