import Constants from "expo-constants"
import { Link } from "expo-router"

import { Button, GetProps, ListItem, Popover, SizableText, Stack, XStack, YGroup, useMedia } from "tamagui"
import { Flower2 } from "@tamagui/lucide-icons"

import { centralized, stylePopover, topLeftIconButton } from ".assets/styles"
import PinkFallbackAvatar from ".components/PinkFallbackAvatar"

const serviceEndpoint: string = Constants.manifest?.extra?.ServiceEndpoint

const pages: Page[] = [{
  title: "chiyoi",
  href: "/chiyoi",
  avatar: new URL("/assets/chiyoi.png", serviceEndpoint).href,
}, {
  title: "nacho",
  href: "/nacho",
  avatar: new URL("/assets/nacho.png", serviceEndpoint).href,
}, {
  title: "shigure",
  href: "/shigure",
  avatar: new URL("/assets/shigure.png", serviceEndpoint).href,
}, {
  title: "trinity",
  href: "/trinity",
  avatar: new URL("/assets/trinity.png", serviceEndpoint).href,
}, {
  title: "teapot test",
  href: "/404",
}]

const styleMenuButton: GetProps<typeof Button> = {
  ...topLeftIconButton,
  color: "$pink8",
  icon: <Flower2 size={30} />,
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
    icon: <PinkFallbackAvatar imageSrc={page.avatar} size={25} />,
    size: "$4",
    width: 170,
    hoverTheme: true,
    pressTheme: true,
    backgroundColor: "$background",
    justifyContent: "flex-start",
  }
}

export default function Neko03() {
  const media = useMedia()

  const title = colorLoopCharacters("neko03★moe")
  title[6].star = true

  // return (
  //   <Stack {...centralized}>
  //     <Link asChild href={new URL("/", serviceEndpoint).href}>
  //       <Button>test</Button>
  //     </Link>
  //   </Stack>
  // )

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
          <Button {...styleMenuButton} />
        </Popover.Trigger>

        <Popover.Content {...stylePopover} backgroundColor="$pink3">
          <YGroup>
            {pages.map((page, i) => (
              <YGroup.Item key={i}>
                <Popover.Close asChild>
                  <Link asChild href={page.href}>
                    <ListItem {...styleListItem(page)}>
                      <SizableText color="$pink8" fontFamily="$neko" size="$8">
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