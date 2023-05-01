import { createContext } from "react"

export const ToastContext = createContext<React.Dispatch<React.SetStateAction<string>>>(() => void 0)