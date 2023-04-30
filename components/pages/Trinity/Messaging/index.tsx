import { useCallback, useMemo, useState } from "react"

import { Button, GetProps, Sheet, Spinner, Toast, ToastProvider, ToastViewport, XGroup, XStack } from "tamagui"
import { Pencil, Send } from "@tamagui/lucide-icons"

import { styleBottomIconButton, styleBounceDown, styleIconButton } from ".assets/styles"
import { ParagraphInput } from ".components/pages/Trinity/Messaging/ParagraphInput"
import { Compose, SendState, emptyCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphPicker } from ".components/pages/Trinity/Messaging/ParagraphPicker"
import { ParagraphType } from ".modules/trinity"
import { post, upload } from ".components/pages/Trinity/message"

const styleSheet: GetProps<typeof Sheet> = {
  animation: "bouncy",
  dismissOnSnapToBottom: true,
}

export default function Messaging() {
  const openState = useState(false)
  const [open, setOpen] = openState

  const [toast, setToast] = useState<string>("")
  const toastOpen = useMemo(() => toast !== "", [toast])
  const setToastOpen = useCallback((toastOpen: boolean) => setToast(toastOpen ? "Unknown notice~" : ""), [])

  const composeState = useState<Compose>(emptyCompose)
  const [compose, setCompose] = composeState

  const send = useCallback(() => {
    (async () => {
      setOpen(false)
      if (compose.type === ParagraphType.Text && compose.text === "" || compose.type !== ParagraphType.Text && compose.name === "") {
        console.warn("empty content or filename")
        return
      }

      try {
        setToast("Sending~")
        setCompose({ ...compose, sendState: SendState.Sending })
        await post([{
          type: compose.type,
          data: compose.type === ParagraphType.Text ? (
            compose.text
          ) : (
            await upload(compose.name, compose.data) || ""
          )
        }])
        setToast("Sent. Waiting server push back.")
        setCompose(emptyCompose)
      } catch (err) {
        console.error(err)
        setToast("Send failed~")
        setCompose({ ...compose, sendState: SendState.Composing })
      }
    })()
  }, [composeState])

  return (
    <>
      <Button {...styleBottomIconButton} onPress={() => setOpen(true)} icon={
        <Pencil size={25} />
      } />

      <Sheet {...styleSheet} snapPoints={[13]} open={open} onOpenChange={setOpen}>
        <Sheet.Overlay />
        <Sheet.Handle />

        <Sheet.Frame>
          <XStack padding="$3" backgroundColor="$color3">
            <Sheet.ScrollView>
              <XGroup backgroundColor="$color3">
                <ParagraphPicker setCompose={setCompose} />
                <ParagraphInput composeState={composeState} />
              </XGroup>
            </Sheet.ScrollView>

            <Button {...styleIconButton} width={45} marginStart="$3" disabled={compose.sendState !== SendState.Composing} onPress={send} icon={
              compose.sendState === SendState.Composing ? (
                <Send size={25} />
              ) : (
                <Spinner size="small" />
              )
            } />
          </XStack>
        </Sheet.Frame>
      </Sheet>

      <ToastProvider duration={2000}>
        <Toast {...styleBounceDown} top={30} open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title color="$color8">{toast}</Toast.Title>
        </Toast>

        <ToastViewport alignSelf="center" />
      </ToastProvider>
    </>
  )
}
