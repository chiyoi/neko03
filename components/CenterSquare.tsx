import { GetProps, Paragraph, Stack } from "tamagui"

import { centralized } from ".assets/styles"

const styleCenterSquare: GetProps<typeof Stack> = {
  minWidth: 300,
  maxHeight: 200,
  backgroundColor: "$pink3"
}

export default function Teapot({ title }: Props) {
  return (
    <Stack {...centralized} backgroundColor="$background">
      <Stack {...centralized} {...styleCenterSquare}>
        <Paragraph fontFamily="$neko" size="$8" color="$pink9">{title}</Paragraph>
      </Stack>
    </Stack>
  )
}

type Props = {
  title: string
}