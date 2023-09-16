import { Avatar } from "tamagui"

export default function ColorAvatar({ size, uri }: Props) {
  return (
    <Avatar size={size} circular>
      {uri && <Avatar.Image source={{ uri, width: size, height: size }} />}
      <Avatar.Fallback backgroundColor="$color5" />
    </Avatar>
  )
}

type Props = {
  size: number,
  uri?: string,
}