import { useCallback, } from "react"

import { Toast, ToastProvider, ToastViewport } from '@tamagui/toast'
import { GetProps, SizableText, XStack } from "tamagui"

import { IDString } from "../toast"

const styleToast: GetProps<typeof Toast> = {
  animation: ["bouncy", {
    opacity: {
      overshootClamping: true,
    },
  }],
  enterStyle: { x: -20, opacity: 0 },
  exitStyle: { x: 20, opacity: 0 },
  x: 0,
  y: 0,
  opacity: 1,
  elevate: true,
}

export function QuickToast({ toastsState: [toasts, setToasts] }: Props) {
  const remove = useCallback((id: number) => setToasts(toasts => toasts.filter(toast => toast.id !== id)), [])

  return (
    <ToastProvider duration={4000}>
      {toasts.map((toast) => (
        <Toast {...styleToast} top={50} key={toast.id} onOpenChange={open => open === false && remove(toast.id)}>
          <XStack alignItems="center" space>
            <SizableText size="$6" color="$color8" fontFamily="$neko">
              {toast.str || "Unknown notice~"}
            </SizableText>
          </XStack>
        </Toast>
      ))}

      <ToastViewport alignSelf="center" multipleToasts />
    </ToastProvider>
  )
}

interface Props {
  toastsState: StateIDStringArray,
}

type StateIDStringArray = [IDString[], React.Dispatch<React.SetStateAction<IDString[]>>]
