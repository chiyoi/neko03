import { Link } from "expo-router"
import { AlertDialog, Button, GetProps, Stack, XStack, YStack } from "tamagui"

const styleErrorAlert: GetProps<typeof AlertDialog.Content> = {
  animation: ["bouncy", {
    opacity: {
      overshootClamping: true,
    },
  }],
  backgroundColor: "$pink3",
  elevate: true,
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

export default function ErrorDialog({ message }: Props) {
  return (
    <Stack height="100%" backgroundColor="$background">
      <AlertDialog open>
        <AlertDialog.Portal>
          <AlertDialog.Content {...styleErrorAlert} >
            <YStack space>
              <AlertDialog.Title fontFamily="$neko" color="$pink8">Error~</AlertDialog.Title>

              <AlertDialog.Description color="$pink8">
                {message || "Unknown error~"}
              </AlertDialog.Description>

              <XStack justifyContent="flex-end">
                <AlertDialog.Action asChild>
                  <Link asChild href="/">
                    <Button fontFamily="$neko" theme="pink">Back</Button>
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
