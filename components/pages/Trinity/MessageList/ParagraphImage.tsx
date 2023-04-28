import { config } from ".modules/config"
import { Image } from "tamagui"

const downloadEndpoint = new URL("/trinity/download/", config.EndpointService()).href

export default function ImageParagraph({ data }: Props) {
  return <Image width={200} height={200} resizeMode="contain" source={{ uri: downloadEndpoint + data }} />
}

interface Props {
  data: string
}
