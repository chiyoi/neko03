import { useState } from "react"

import { Button, GetProps, ListItem, Paragraph, Sheet, Image, Spinner, Stack, XGroup, XStack, YGroup } from "tamagui"
import { Pencil, Send } from "@tamagui/lucide-icons"

import { bottomIconButton, iconButton } from ".assets/styles"
import { ParagraphInput } from ".components/pages/Trinity/Messaging/ParagraphInput"
import { Compose, SendState, StateCompose, emptyCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphPicker } from ".components/pages/Trinity/Messaging/ParagraphPicker"
import { ParagraphType } from ".modules/trinity"
import { post } from ".components/pages/Trinity/message"
import { upload } from ".components/pages/Trinity/reference"
import { handle } from ".modules/axios_utils"


type StateBoolean = [boolean, React.Dispatch<React.SetStateAction<boolean>>]
type StateNumber = [number, React.Dispatch<React.SetStateAction<number>>]
function styleSheet([open, setOpen]: StateBoolean, [position, setPosition]: StateNumber, snapPoint: number): GetProps<typeof Sheet> {
  return {
    animation: "bouncy",
    dismissOnSnapToBottom: true,
    onOpenChange: setOpen,
    onPositionChange: setPosition,
    open: open,
    position: position,
    snapPoints: [snapPoint],
  }
}

export default function Messaging() {
  const openState = useState(false)
  const [, setOpen] = openState
  const positionState = useState(1)
  const [snapPoint, setSnapPoint] = useState(13)

  const composeState = useState<Compose>(emptyCompose)
  const [compose, setCompose] = composeState

  return (
    <>
      <Button {...bottomIconButton} onPress={() => setOpen(true)}>
        <Pencil />
      </Button>

      <Sheet {...styleSheet(openState, positionState, snapPoint)}>
        <Sheet.Overlay />
        <Sheet.Handle />

        <Sheet.Frame>
          <XStack padding="$3" backgroundColor="$pink3">
            <Sheet.ScrollView>
              <XGroup backgroundColor="$pink3">
                <ParagraphPicker setCompose={setCompose} />
                <ParagraphInput composeState={composeState} />
              </XGroup>
            </Sheet.ScrollView>

            <Button {...iconButton} disabled={compose.sendState !== SendState.Composing} onPress={() => uploadAndPost(composeState)} marginStart="$3">
              {compose.sendState === SendState.Composing ? (
                <Send />
              ) : (
                <Spinner size="small" />
              )}
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

async function uploadAndPost([compose, setCompose]: StateCompose) {
  if (compose.type === ParagraphType.Unknown) {
    console.warn("unknown paragraph type")
    return
  }

  if (compose.type === ParagraphType.Text && compose.text === "" || compose.type !== ParagraphType.Text && compose.name === "") {
    console.warn("empty content or filename")
    return
  }

  setCompose({ ...compose, sendState: SendState.Sending })

  try {
    await post([{
      type: compose.type,
      data: compose.type === ParagraphType.Text ? compose.text : (
        await upload(compose.name, compose.data)
      )
    }])
    setCompose(emptyCompose)
  } catch (err) {
    handle(err)
    setCompose({ ...compose, sendState: SendState.Composing })
  }
}
