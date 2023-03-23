export const getUrlOrigin = (urlString: string): string => {
  const url = new URL(urlString)
  return url.origin
}
