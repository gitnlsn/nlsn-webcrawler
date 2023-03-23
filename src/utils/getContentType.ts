import { AxiosResponse } from "axios"

export const getContentType = (headers: AxiosResponse["headers"]): string =>
  // @ts-expect-error
  String(headers.getContentType())

export const getContentTypeFromRecord = (
  headers: Record<string, string>
): string | undefined => {
  const contentTypeKey = Object.keys(headers).find(
    (possibleKey) => possibleKey.toLowerCase() === "content-type"
  )

  if (!contentTypeKey) {
    return undefined
  }

  return headers[contentTypeKey]
}
