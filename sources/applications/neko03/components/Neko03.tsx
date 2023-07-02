import axios from "axios"
import { useContext, useEffect, useMemo } from "react"
import { useAssets } from "expo-asset"
import { Link } from "expo-router"

import { Button, GetProps, ListItem, Popover, SizableText, Stack, XStack, YGroup, useMedia } from "tamagui"
import { Flower2, Cherry, Citrus } from "@tamagui/lucide-icons"

import { centralized, styleBounceDown, styleTopLeftIconButton } from ".assets/styles"
import ColorAvatar from ".components/ColorAvatar"
import ErrorDialog from ".components/ErrorDialog"
import CenterSquare from ".components/CenterSquare"
import { ToastContext } from ".modules/toast"
import { config } from ".modules/config"

const styleCharacter: GetProps<typeof SizableText> = {
  fontFamily: "$neko",
  padding: 1,
}

const styleListItem: GetProps<typeof ListItem> = {
  size: "$4",
  width: 170,
  hoverTheme: true,
  pressTheme: true,
  backgroundColor: "$color2",
  justifyContent: "flex-start",
}

export default function Neko03() {
  const toast = useContext(ToastContext)

  const [assets, error] = useAssets([
    require(".assets/icons/chiyoi.png"),
    require(".assets/icons/nacho.png"),
    require(".assets/icons/shigure.png"),
    require(".assets/icons/trinity.png"),
  ])

  const pages: Page[] = useMemo(() => [
    {
      title: "chiyoi",
      href: "/chiyoi",
      avatar: assets?.[0].localUri ?? undefined,
    }, {
      title: "nacho",
      href: "/nacho",
      avatar: assets?.[1].localUri ?? undefined,
    }, {
      title: "shigure",
      href: "/shigure",
      avatar: assets?.[2].localUri ?? undefined,
    },
  ], [assets])

  const media = useMedia()

  const title = colorLoopCharacters("neko03★moe")

  if (error !== undefined) {
    return <ErrorDialog message={error.message} />
  }

  if (assets === undefined) {
    return <CenterSquare title="Loading~" />
  }

  return (
    <>
      <Stack {...centralized} backgroundColor="$background">
        <XStack alignItems="flex-end" scale={media.xs ? 0.3 : media.sm ? 0.8 : 1}>
          {title.map((c, i) => (
            <SizableText {...styleCharacter} color={`$${c.color}8`} size={i == 6 ? "$10" : "$16"} key={i}>
              {c.char}
            </SizableText>
          ))}
        </XStack>
      </Stack>

      <Popover placement="bottom-start">
        <Popover.Trigger asChild>
          <Button {...styleTopLeftIconButton} chromeless icon={
            Math.random() > 0.5 ? (
              <Citrus size={30} />
            ) : Math.random() > 0.5 ? (
              <Cherry size={30} />
            ) : (
              <Flower2 size={30} />
            )
          } />
        </Popover.Trigger>

        <Popover.Content {...styleBounceDown} backgroundColor="$color4">
          <YGroup>
            {pages.map((page, i) => (
              <YGroup.Item key={i}>
                <Popover.Close asChild>
                  <Link asChild href={page.href}>
                    <ListItem {...styleListItem} icon={(
                      <ColorAvatar size={25} uri={page.avatar} />
                    )}>
                      <SizableText color="$color7" fontFamily="$neko" size="$8">
                        {page.title}
                      </SizableText>
                    </ListItem>
                  </Link>
                </Popover.Close>
              </YGroup.Item>
            ))}
          </YGroup>
        </Popover.Content>
      </Popover>
    </>
  )
}

function colorLoopCharacters(s: string): ColoredCharacter[] {
  const color = loop(["pink", "blue", "yellow", "green"], 1)
  return [...s].map(c => { return { char: c, color: color() } })
}

function loop(a: any[], i: number) {
  return () => a[i++ % a.length]
}

type ColoredCharacter = {
  char: string,
  color: string,

  star?: boolean,
}

type Page = {
  title: string,
  href: string,
  avatar?: string,
}
