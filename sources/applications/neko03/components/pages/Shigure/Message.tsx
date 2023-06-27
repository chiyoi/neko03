import { GetProps, SizableText, XStack, YStack } from "tamagui"

const chars: RubiedCharacter[] = [
  { ruby: "し", text: "時" },
  { ruby: "ぐれ", text: "雨" },
  { ruby: "さま", text: "様" },
  { ruby: "だい", text: "大" },
  { ruby: "だい", text: "大" },
  { ruby: "だい", text: "大" },
  { ruby: "だい", text: "大" },
  { ruby: "す", text: "好" },
  { ruby: "き", text: "き" },
]

const styleCharacter: GetProps<typeof SizableText> = {
  color: "#f5f4f3",
  fontFamily: "$neko",
  padding: 5,
  size: "$15",
  textShadowColor: "#446069",
  textShadowOffset: { width: 2, height: 3 },
  textShadowRadius: 5,
}

const styleRubyCharacter: GetProps<typeof SizableText> = {
  ...styleCharacter,
  size: "$9",
  textShadowOffset: { width: 1, height: 2 },
  textShadowRadius: 2,
}

export default function Message() {
  return (
    <XStack>
      {chars.map(({ ruby, text }, i) => (
        <YStack alignItems="center" key={i}>
          <SizableText {...styleRubyCharacter} >{ruby}</SizableText>
          <SizableText {...styleCharacter}>{text}</SizableText>
        </YStack>
      ))}
    </XStack>
  )
}

type RubiedCharacter = {
  ruby: string
  text: string
}
