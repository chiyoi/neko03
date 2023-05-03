import axios from "axios"
import { useCallback, useContext, useEffect, useState } from "react"
import { createURL, openURL } from "expo-linking"

import { Button, GetProps, Paragraph, Popover, XStack, YStack } from "tamagui"

import { styleBounceDown, styleTopRightIconButton } from ".assets/styles"
import ColorBackAvatar from ".components/ColorAvatar"
import { AuthContext, clearCache, query } from ".components/pages/Trinity/auth"
import { config } from ".modules/config"
import { Name } from ".modules/trinity"

const avatarURL = new URL("/trinity/avatar/me", config.EndpointService).href
const nameURL = new URL("/trinity/name", config.EndpointService).href

export default function Me() {
  const auth = useContext(AuthContext)

  const [name, setName] = useState<Name | null>(null)
  const getName = useCallback(async () => {
    if (auth !== null) {
      const resp = await axios.get<Name>(nameURL + "?" + query(auth))
      setName(resp.data)
    }
  }, [auth])

  useEffect(() => { getName() }, [getName])

  if (name === null) {
    return null
  }

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <Button {...styleTopRightIconButton} chromeless icon={
          <ColorBackAvatar size={35} uri={avatarURL + "?" + query(auth)} />
        } />
      </Popover.Trigger>

      <Popover.Content {...styleBounceDown} backgroundColor="$color3">
        <Popover.Arrow backgroundColor="$color3" />

        <YStack space>
          <Paragraph size="$6" fontFamily="$neko" color="$color8" paddingEnd={30}>{name.display_name}</Paragraph>
          <Paragraph size="$3" fontFamily="$neko" color="$color7" paddingEnd={30}>{name.user_principal_name}</Paragraph>

          <XStack justifyContent="flex-end">
            <Button fontFamily="$neko" color="$color8" onPress={logout}>logout</Button>
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
