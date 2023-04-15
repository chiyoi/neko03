import { stylePopover, topRightIconButton } from ".assets/styles"
import CenterSquare from ".components/CenterSquare"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"
import { AuthContext, clearCache } from ".components/pages/Trinity/auth"
import { Name } from ".modules/trinity"
import axios from "axios"
import Constants from "expo-constants"
import { createURL, openURL } from "expo-linking"
import { useContext, useEffect, useState } from "react"
import { Button, GetProps, Paragraph, Popover, XStack, YStack } from "tamagui"

const serviceEndpoint = Constants.manifest?.extra?.ServiceEndpoint

const avatarURL = new URL("/trinity/avatar/me", serviceEndpoint).href
const nameURL = new URL("/trinity/name", serviceEndpoint).href

function styleAvatarButton(avatarSrc: string): GetProps<typeof Button> {
  return {
    ...topRightIconButton,
    color: "$pink8",
    icon: <PinkFallbackAvatar imageSrc={avatarSrc} size={30} />
  }
}

export default function Me() {
  const auth = useContext(AuthContext)

  const [name, setName] = useState<Name | null>(null)
  useEffect(() => {
    if (auth !== null) {
      getName(setName)
    }
  }, [auth])

  if (name === null) {
    return null
  }

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <Button {...styleAvatarButton(avatarURL)} />
      </Popover.Trigger>

      <Popover.Content {...stylePopover} backgroundColor="$pink3">
        <Popover.Arrow backgroundColor="$pink3" />

        <YStack space>
          <Paragraph size="$6" fontFamily="$neko" paddingEnd={30}>{name.display_name}</Paragraph>
          <Paragraph size="$3" fontFamily="$neko" paddingEnd={30}>{name.user_principal_name}</Paragraph>

          <XStack justifyContent="flex-end">
            <Button fontFamily="$neko" onPress={logout}>logout</Button>
          </XStack>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

async function getName(setName: (name: Name) => void) {
  const resp = await axios.get<Name>(nameURL)
  setName(resp.data)
}

async function logout() {
  await clearCache()
  openURL(createURL("/"))
}
