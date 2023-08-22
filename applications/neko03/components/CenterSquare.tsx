import { GetProps, Paragraph, Stack } from "tamagui"

import { centralized } from ".assets/styles"

const styleCenterSquare: GetProps<typeof Stack> = {
  minWidth: 300,
  maxHeight: 200,
  backgroundColor: "$color3"
}

const styleTitle: GetProps<typeof Paragraph> = {
  fontFamily: "$neko",
  size: "$8",
  color: "$color8",
}

export default function Teapot({ title }: Props) {
  return (
    <Stack {...centralized} backgroundColor="$background">
      <Stack {...centralized} {...styleCenterSquare}>
        <Paragraph {...styleTitle}>{title}</Paragraph>
      </Stack>
    </Stack>
  )
}

type Props = {
  title: string
}