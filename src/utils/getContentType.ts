import { AxiosResponse } from "axios"

export const getContentType = (headers: AxiosResponse["headers"]): string =>
  // @ts-expect-error
  String(headers.getContentType())
