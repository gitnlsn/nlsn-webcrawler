import { MainModule } from "./module/main"

import getOptions from "get-options"
import { DataModule } from "./module/data"

export const handleCommandLine = () => {
  const { options } = getOptions(process.argv, {
    "-i, --insertUrl": "[UrlPath]",
  })

  if (Object.keys(options).includes("insertUrl")) {
    const url = options.insertUrl

    DataModule.create().then((module) => module.insertBaseUlrs([url]))
    return
  }

  MainModule.create()
    .then((module) => module.scheduleCronJobs())
    .then(() => {
      console.log("Application started")
    })
    .catch(console.error)
}
