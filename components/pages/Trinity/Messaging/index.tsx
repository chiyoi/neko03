import { useState } from "react"

import { Button, GetProps, Sheet, Spinner, XGroup, XStack } from "tamagui"
import { Pencil, Send } from "@tamagui/lucide-icons"

import { bottomIconButton, iconButton } from ".assets/styles"
import { ParagraphInput } from ".components/pages/Trinity/Messaging/ParagraphInput"
import { Compose, SendState, StateCompose, emptyCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphPicker } from ".components/pages/Trinity/Messaging/ParagraphPicker"
import { ParagraphType } from ".modules/trinity"
import { post, upload } from ".components/pages/Trinity/message"
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
  const [snapPoint] = useState(13)

  const composeState = useState<Compose>(emptyCompose)
  const [compose, setCompose] = composeState

  return (
    <>
      <Button {...bottomIconButton} onPress={() => setOpen(true)}>
        <Pencil color="$color8" />
      </Button>

      <Sheet {...styleSheet(openState, positionState, snapPoint)}>
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

            <Button {...iconButton} width={45} marginStart="$3" disabled={compose.sendState !== SendState.Composing} onPress={() => uploadAndPost(composeState)}>
              {compose.sendState === SendState.Composing ? (
                <Send color="$color8" />
              ) : (
                <Spinner size="small" color="$color8" />
              )}
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

async function uploadAndPost([compose, setCompose]: StateCompose) {
  if (compose.type === ParagraphType.Text && compose.text === "" || compose.type !== ParagraphType.Text && compose.name === "") {
    console.warn("empty content or filename")
    return
  }

  setCompose({ ...compose, sendState: SendState.Sending })

  try {
    post([{
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
