import { useState } from "react"

import { Button, Paragraph, Sheet, YStack } from "tamagui"
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

      <Sheet modal open={open} snapPoints={[24]} onOpenChange={setOpen}>
        <Sheet.Overlay />

        <Sheet.Frame backgroundColor="$color3">
          <YStack space margin={20}>
            <Paragraph size="$6" fontFamily="$neko" color="$color8" paddingEnd={30}>Remove?</Paragraph>
            <YStack space={5}>
              <Button fontFamily="$neko" color="$color8" onPress={() => [setOpen(false), setRemoving(true), onConfirm()]}>
                confirm
              </Button>
              <Button fontFamily="$neko" theme="gray" onPress={() => setOpen(false)}>
                cancel
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

interface Props {
  onConfirm: () => void,
}
