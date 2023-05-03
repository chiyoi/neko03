import { createContext } from "react"

export const ToastContext = createContext<(toast: string) => void>(() => void 0)

export type IDString = {
  id: number,
  str: string,
}