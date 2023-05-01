import { useCallback } from "react"

import { Button, GetProps, ListItem, Popover, SizableText, YGroup } from "tamagui"
import { Component } from "@tamagui/lucide-icons"

import { styleIconButton, styleBounceUp } from ".assets/styles"
import { ParagraphType } from ".modules/trinity"
import { StateCompose, emptyFile, emptyText } from ".components/pages/Trinity/Messaging/compose"

const data: ParagraphTypeListItem[] = [
  {
    type: ParagraphType.Text,
    name: "text",
  }, {
    type: ParagraphType.File,
    name: "file",
  },
]

const styleListItem: GetProps<typeof ListItem> = {
  size: "$4",
  width: 100,
  hoverTheme: true,
  pressTheme: true,
  backgroundColor: "$color2",
  justifyContent: "flex-start",
}

export function ParagraphPicker({ setCompose }: Props) {
  const pick = useCallback((type: ParagraphType) => setCompose(
    type === ParagraphType.File ? (
      emptyFile
    ) : (
      emptyText
    )
  ), [])

  return (
    <Popover placement="top-start">
      <Popover.Trigger asChild>
        <Button {...styleIconButton} width={45} chromeless icon={
          <Component size={25} />
        } />
      </Popover.Trigger>

      <Popover.Content {...styleBounceUp} size="$3" theme="pink" backgroundColor="$color3">
        <Popover.Arrow backgroundColor="$color3" />

        <YGroup>
          {data.map(({ type, name }) => (
            <YGroup.Item key={type}>
              <Popover.Close asChild>
                <ListItem {...styleListItem} onPress={() => pick(type)}>
                  <SizableText color="$color8" fontFamily="$neko" size="$6">
                    {name}
                  </SizableText>
                </ListItem>
              </Popover.Close>
            </YGroup.Item>
          ))}
        </YGroup>
      </Popover.Content>
    </Popover>
  )
}

interface Props {
  setCompose: StateCompose[1],
}

type ParagraphTypeListItem = {
  type: ParagraphType,
  name: string,
}