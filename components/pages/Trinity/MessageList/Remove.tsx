import { useState } from "react"

import { Button, Paragraph, Sheet, XStack, YStack } from "tamagui"
import { Trash } from "@tamagui/lucide-icons"

import { styleIconButton } from ".assets/styles"

export default function Remove({ onConfirm }: Props) {
  const [open, setOpen] = useState(false)
  const [removing, setRemoving] = useState(false)

  return (
    <>
      <Button {...styleIconButton} disabled={removing} chromeless onPress={() => setOpen(true)} icon={
        <Trash size={15} />
      } />

      <Sheet modal open={open} snapPoints={[15]} onOpenChange={setOpen}>
        <Sheet.Overlay />

        <Sheet.Frame backgroundColor="$color3">
          <YStack space>
            <Paragraph marginTop={10} marginStart={10} size="$6" fontFamily="$neko" color="$color8" paddingEnd={30}>Remove?</Paragraph>

            <XStack marginEnd={10} flex={1} justifyContent="flex-end">
              <Button fontFamily="$neko" color="$color8" onPress={() => [setOpen(false), setRemoving(true), onConfirm()]}>
                confirm
              </Button>
              <Button fontFamily="$neko" theme="gray" chromeless onPress={() => setOpen(false)}>
                cancel
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

interface Props {
  onConfirm: () => void,
}
