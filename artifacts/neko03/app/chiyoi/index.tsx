import { useAssets } from "expo-asset"
import { Link } from "expo-router"

import { Button, Paragraph, Stack, XStack, YStack, useMedia } from "tamagui"
import { Github, Twitter } from "@tamagui/lucide-icons"

import { centralized, styleIconButton } from ".modules/assets/styles"
import BackButton from ".modules/components/BackButton"
import ColorAvatar from ".modules/components/ColorAvatar"
import CenterSquare from ".modules/components/CenterSquare"
import ErrorDialog from ".modules/components/ErrorDialog"
import { ToastContext } from ".modules/toast"
import { useContext, useEffect } from "react"

export default function Chiyoi() {
  const toast = useContext(ToastContext)
  const media = useMedia()

  const [assets, error] = useAssets([require(".modules/assets/icons/chiyoi.png")])

  useEffect(() => {
    toast("Nyan~")
  }, [])

  if (error !== undefined) {
    return <ErrorDialog message={error.message} />
  }

  if (assets === undefined) {
    return <CenterSquare title="Loading~" />
  }

  return (
    <>
      <Stack {...centralized} backgroundColor="$background">
        <YStack {...centralized} space={media.sm ? 20 : 25}>
          <ColorAvatar uri={assets[0].localUri ?? undefined} size={media.sm ? 250 : 300} />

          <Paragraph fontFamily="$neko" color="$pink7" size={media.sm ? "$12" : "$14"} letterSpacing={8}>CHIYOI</Paragraph>

          <XStack alignItems="flex-start" space={media.sm ? 50 : 70}>
            <Link asChild href="https://twitter.com/chiyoi2140" >
              <Button {...styleIconButton} width={45} color="$blue8" icon={
                <Twitter size={20} />
              } />
            </Link>

            <Link asChild href="https://github.com/chiyoi">
              <Button {...styleIconButton} width={45} color="$gray12" icon={
                <Github size={20} />
              } />
            </Link>
          </XStack>
        </YStack>
      </Stack>

      <BackButton />
    </>
  )
}
