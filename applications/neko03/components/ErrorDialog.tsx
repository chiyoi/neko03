import { Link } from "expo-router"

import { AlertDialog, Button, GetProps, Stack, XStack, YStack } from "tamagui"

const styleDialog: GetProps<typeof AlertDialog.Content> = {
  animation: ["bouncy", {
    opacity: {
      overshootClamping: true,
    },
  }],
  backgroundColor: "$color3",
  elevation: 1,
  enterStyle: { x: 0, y: -20, opacity: 0, scale: 0.9 },
  exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 },
  key: "content",
  opacity: 1,
  scale: 1,
  theme: "$theme",
  width: 300,
  x: 0,
  y: 0,
}

const styleTitle: GetProps<typeof AlertDialog.Title> = {
  fontFamily: "$neko",
  color: "$color7",
}

const styleDescription: GetProps<typeof AlertDialog.Description> = {
  color: "$color8",
}

const styleButton: GetProps<typeof Button> = {
  fontFamily: "$neko",
  color: "$color8",
}

export default function ErrorDialog({ message }: Props) {
  return (
    <Stack height="100%" backgroundColor="$background">
      <AlertDialog open>
        <AlertDialog.Portal>
          <AlertDialog.Content {...styleDialog} theme="pink">
            <YStack space>
              <AlertDialog.Title {...styleTitle}>Error~</AlertDialog.Title>

              <AlertDialog.Description {...styleDescription}>
                {message || "Unknown error~"}
              </AlertDialog.Description>

              <XStack justifyContent="flex-end">
                <AlertDialog.Action asChild>
                  <Link asChild href="/">
                    <Button {...styleButton}>Back</Button>
                  </Link>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </Stack>
  )
}

interface Props {
  message: string
}
