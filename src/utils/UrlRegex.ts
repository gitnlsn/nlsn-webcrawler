// Regex from: https://uibakery.io/regex-library/url (2023-03-22)

export const UrlRegex =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?!&\/=]*)$/

export const isAbsoluteUrlPath = (possibleUrl: string): boolean =>
  UrlRegex.test(possibleUrl)

export const RelativePathRegex = /^\/(?:[-a-zA-Z0-9()@:%_\+.~#?!&\/=]*)$/

export const isRelativeUrlPath = (possibleUrlPath: string): boolean =>
  RelativePathRegex.test(possibleUrlPath)
