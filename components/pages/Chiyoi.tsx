import Constants from "expo-constants"
import { Link } from "expo-router"

import { Avatar, Button, Paragraph, SizableText, Stack, XStack, YStack, useMedia } from "tamagui"
import { ChevronLeft, Github, Twitter } from "@tamagui/lucide-icons"

import { centralized, iconButton, topLeftIconButton } from ".assets/styles"
import BackButton from ".components/BackButton"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"

function sizeMedia({ xs, sm }: { xs?: boolean, sm?: boolean }) {
  return xs ? 200 : sm ? 250 : 300
}

export default function Chiyoi() {
  const media = useMedia()

  const serviceEndpoint: string = Constants.manifest?.extra?.ServiceEndpoint
  const iconChiyoi = new URL("/assets/chiyoi.png", serviceEndpoint).href

  return (
    <>
      <Stack {...centralized} backgroundColor="$background">
        <YStack {...centralized} space={media.sm ? 20 : 25}>
          <PinkFallbackAvatar imageSrc={iconChiyoi} size={sizeMedia(media)} />

          <Paragraph fontFamily="$neko" color="$pink7" size={media.sm ? "$12" : "$14"} letterSpacing={8}>CHIYOI</Paragraph>

          <XStack alignItems="flex-start" space={media.sm ? 50 : 70}>
            <Link asChild href="https://twitter.com/chiyoi2140" >
              <Button {...iconButton} theme="blue" color="$blue8" icon={
                <Twitter size={20} />
              } />
            </Link>

            <Link asChild href="https://github.com/chiyoi">
              <Button {...iconButton} color="black" icon={
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
