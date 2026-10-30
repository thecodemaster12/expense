import { createContext, useContext } from 'react'

export type Toast = { message: string; action?: { label: string; onClick: () => void } }

export const ToastContext = createContext<(toast: Toast) => void>(() => {})

export const useToast = () => useContext(ToastContext)
