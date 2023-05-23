import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react"

type AppState = {
  pressedKey: string | null
}

const initialAppState: AppState = {
  pressedKey: null,
}

type AppContext = {
  appState: AppState
  setAppState: Dispatch<SetStateAction<AppState>>
}
export const AppContext = createContext<AppContext>({
  appState: initialAppState,
  setAppState: () => ({}),
})

type AppContextProviderProps = {
  children: ReactNode
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [appState, setAppState] = useState<AppState>({
    pressedKey: null,
  })

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      setAppState((currentAppState) => ({
        ...currentAppState,
        pressedKey: event.key,
      }))
    })
  }, [])

  return <AppContext.Provider value={{ appState, setAppState }}>{children}</AppContext.Provider>
}
