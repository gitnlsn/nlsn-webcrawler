import { MainModule } from "./module/main"

new MainModule()
  .init()
  .then(() => {
    console.log("Application started")
  })
  .catch(console.error)
