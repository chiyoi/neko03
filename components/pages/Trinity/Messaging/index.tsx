import { useCallback, useContext, useMemo, useState } from "react"

import { Button, GetProps, Sheet, Spinner, Toast, ToastProvider, ToastViewport, XGroup, XStack } from "tamagui"
import { Pencil, Send } from "@tamagui/lucide-icons"

import { styleBottomIconButton, styleBounceDown, styleIconButton } from ".assets/styles"
import { ParagraphInput } from ".components/pages/Trinity/Messaging/ParagraphInput"
import { emptyText, ComposeReference, ComposeText } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphPicker } from ".components/pages/Trinity/Messaging/ParagraphPicker"
import { Paragraph, ParagraphType } from ".modules/trinity"
import { config } from ".modules/config"
import { errorMessage } from ".modules/axios_utils"
import { uploadAsync } from "expo-file-system"
import { AuthContext, query } from ".components/pages/Trinity/auth"
import axios from "axios"
import { ToastContext } from ".modules/toast"

const endpointService = config.EndpointNeko03

const endpointPost = new URL("/trinity/post", endpointService).href
const endpointUpload = new URL("/trinity/upload/", endpointService).href

const styleSheet: GetProps<typeof Sheet> = {
  animation: "bouncy",
  dismissOnSnapToBottom: true,
}

export default function Messaging() {
  const auth = useContext(AuthContext)
  const toast = useContext(ToastContext)

  const openState = useState(false)
  const [open, setOpen] = openState

  const composeState = useState<ComposeText | ComposeReference>(emptyText)
  const [compose, setCompose] = composeState
  const [sending, setSending] = useState(false)

  const post = useCallback(async (content: Paragraph[]) => {
    if (content.length === 0) {
      console.warn("empty post")
      return
    }

    try {
      const req: RequestPost = { content }
      const resp = await axios.post(endpointPost + "?" + query(auth), JSON.stringify(req))
      resp.status !== 200 && (
        console.warn("upload failed")
      )
    } catch (err) {
      console.warn(errorMessage(err))
    }
  }, [auth])

  const upload = useCallback(async (filename: string, uri: string): Promise<string | undefined> => {
    const resp = await uploadAsync(endpointUpload + filename + "?" + query(auth), uri, { httpMethod: "PUT" })
    if (resp.status != 200) {
      console.warn("upload failed")
      return
    }
    return JSON.parse(resp.body)
  }, [auth])


  const send = useCallback(async () => {
    setOpen(false)
    if (compose.type === ParagraphType.Text && compose.text === "" || compose.type !== ParagraphType.Text && compose.filename === "") {
      console.warn("empty content or filename")
      return
    }

    toast("Sending~")
    setSending(true)
    try {
      await post([{
        type: compose.type,
        data: compose.type === ParagraphType.Text ? (
          compose.text
        ) : (
          await upload(compose.filename, compose.uri) || ""
        )
      }])
      toast("Sent.")
      setCompose(emptyText)
    } catch (err) {
      console.error(err)
      toast("Send failed~")
    }
    setSending(false)
  }, [compose])

  return (
    <>
      <Button {...styleBottomIconButton} onPress={() => setOpen(true)} icon={
        <Pencil size={25} />
      } />

      <Sheet {...styleSheet} position={0} snapPoints={[13]} open={open} onOpenChange={setOpen}>
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

            <Button {...styleIconButton} marginStart="$3" disabled={sending} onPress={send} icon={
              sending ? (
                <Spinner size="small" />
              ) : (
                <Send size={25} />
              )
            } />
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

type RequestPost = {
  content: Paragraph[],
}
