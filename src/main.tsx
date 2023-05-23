import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { AppContextProvider } from "./store/context.tsx"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
)
