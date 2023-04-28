import { Avatar, SizeTokens } from "tamagui"

export default function ColorAvatar({ imageSrc, size }: Props) {
  return (
    <Avatar size={size} circular>
      {imageSrc ? <Avatar.Image source={{ uri: imageSrc }} /> : null}
      <Avatar.Fallback backgroundColor="$color5" />
    </Avatar>
  )
}

type Props = {
  imageSrc: string | undefined,
  size: SizeTokens,
}