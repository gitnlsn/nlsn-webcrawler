export interface UrlPathWithFiles {
  urlPath: string
  fileUrls: string[]
}

export interface InsertPathWithFilesProps {
  baseUrlId: string
  data: UrlPathWithFiles
}
