export const getBaseUrl = (urlPath: string): string => {
  const url = new URL(urlPath)
  return url.hostname
}
