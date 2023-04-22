import { useAssets } from "expo-asset"
import { Link } from "expo-router"

import { Button, Paragraph, Stack, XStack, YStack, useMedia } from "tamagui"
import { Github, Twitter } from "@tamagui/lucide-icons"

import { centralized, iconButton } from ".assets/styles"
import BackButton from ".components/BackButton"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"
import CenterSquare from ".components/CenterSquare"
import ErrorDialog from ".components/ErrorDialog"

export default function Chiyoi() {
  const media = useMedia()

  const [assets, error] = useAssets([require(".assets/icons/chiyoi.png")])

  if (error !== undefined) {
    return <ErrorDialog message={error.message} />
  }

  if (assets === undefined) {
    return <CenterSquare title="Loading~" />
  }

  const [{ uri: iconChiyoi }] = assets

  return (
    <>
      <Stack {...centralized} backgroundColor="$background">
        <YStack {...centralized} space={media.sm ? 20 : 25}>
          <PinkFallbackAvatar imageSrc={iconChiyoi} size={media.sm ? 250 : 300} />

          <Paragraph fontFamily="$neko" color="$pink7" size={media.sm ? "$12" : "$14"} letterSpacing={8}>CHIYOI</Paragraph>

          <XStack alignItems="flex-start" space={media.sm ? 50 : 70}>
            <Link asChild href="https://twitter.com/chiyoi2140" >
              <Button {...iconButton} width={45} theme="blue" color="$blue8" icon={
                <Twitter size={20} />
              } />
            </Link>

            <Link asChild href="https://github.com/chiyoi">
              <Button {...iconButton} width={45} color="black" icon={
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
