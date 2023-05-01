import { useCallback, useMemo } from "react"

import { Button, Paragraph, SizableText, Toast, ToastProvider, ToastViewport, XStack } from "tamagui"

import { styleBounceDown, styleIconButton } from ".assets/styles"
import { Circle } from "@tamagui/lucide-icons"

export function QuickToast({ toastState: [toast, setToast] }: Props) {
  const open = useMemo(() => toast !== "", [toast])
  const setOpen = useCallback((toastOpen: boolean) => setToast(toastOpen ? "Unknown notice~" : ""), [])

  return (
    <ToastProvider duration={4000}>
      <Toast {...styleBounceDown} top={50} open={open} onOpenChange={setOpen}>
        <XStack alignItems="center" space>
          <SizableText size="$6" color="$color8" fontFamily="$neko">
            {toast}
          </SizableText>
          <Button {...styleIconButton} onPress={() => setOpen(false)} icon={
            <Circle size={25} />
          } />
        </XStack>
      </Toast>

      <ToastViewport alignSelf="center" />
    </ToastProvider>
  )
}

interface Props {
  toastState: StateString,
}

type StateString = [string, React.Dispatch<React.SetStateAction<string>>]
