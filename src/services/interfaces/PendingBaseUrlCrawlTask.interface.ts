export interface PendingBaseUrlCrawlTask {
  baseUrlId: string // uuid
}

export interface PendingBaseUrlCrawlTaskHandler {
  run: (pendingTask: PendingBaseUrlCrawlTask) => Promise<void>
}

export interface PendingBaseUrlProvider {
  getPendingBaseUrlIds: () => Promise<string[]>
}
