import { Avatar, SizeTokens } from "tamagui"

export default function PinkFallbackAvatar({ imageSrc, size }: Props) {
  return (
    <Avatar size={size} circular>
      <Avatar.Image src={imageSrc} />
      <Avatar.Fallback backgroundColor="$pink6" />
    </Avatar>
  )
}

type Props = {
  imageSrc: string | undefined,
  size: SizeTokens,
}