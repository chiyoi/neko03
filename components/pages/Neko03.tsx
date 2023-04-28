import { useAssets } from "expo-asset"
import { Link } from "expo-router"

import { Button, GetProps, ListItem, Popover, SizableText, Stack, XStack, YGroup, useMedia } from "tamagui"
import { Flower2, Cherry, Citrus } from "@tamagui/lucide-icons"

import { centralized, stylePopover, topLeftIconButton } from ".assets/styles"
import ColorAvatar from ".components/ColorAvatar"
import ErrorDialog from ".components/ErrorDialog"
import CenterSquare from ".components/CenterSquare"
import { useMemo } from "react"

function styleMenuButton(): GetProps<typeof Button> {
  return {
    ...topLeftIconButton,
    icon: Math.random() > 0.5 ? (
      <Citrus size={30} />
    ) : Math.random() > 0.5 ? (
      <Cherry size={30} />
    ) : (
      <Flower2 size={30} />
    ),
  }
}

function styleCharacter(c: ColoredCharacter): GetProps<typeof SizableText> {
  return {
    fontFamily: "$neko",
    size: c.star ? "$10" : "$16",
    color: `$${c.color}8`,
    padding: 1,
  }
}

function styleListItem(page: Page): GetProps<typeof ListItem> {
  return {
    icon: <ColorAvatar imageSrc={page.avatar} size={25} />,
    size: "$4",
    width: 170,
    hoverTheme: true,
    pressTheme: true,
    backgroundColor: "$color2",
    justifyContent: "flex-start",
  }
}

export default function Neko03() {
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
      avatar: assets?.[0].uri,
    }, {
      title: "nacho",
      href: "/nacho",
      avatar: assets?.[1].uri,
    }, {
      title: "shigure",
      href: "/shigure",
      avatar: assets?.[2].uri,
    }, {
      title: "trinity",
      href: "/trinity",
      avatar: assets?.[3].uri,
    }, {
      title: "teapot test",
      href: "/404",
    },
  ], [assets])

  const media = useMedia()

  const title = colorLoopCharacters("neko03★moe")
  title[6].star = true

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
            <SizableText {...styleCharacter(c)} key={i}>
              {c.char}
            </SizableText>
          ))}
        </XStack>
      </Stack>

      <Popover placement="bottom-start">
        <Popover.Trigger asChild>
          <Button {...styleMenuButton()} />
        </Popover.Trigger>

        <Popover.Content {...stylePopover} backgroundColor="$color4">
          <YGroup>
            {pages.map((page, i) => (
              <YGroup.Item key={i}>
                <Popover.Close asChild>
                  <Link asChild href={page.href}>
                    <ListItem {...styleListItem(page)}>
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