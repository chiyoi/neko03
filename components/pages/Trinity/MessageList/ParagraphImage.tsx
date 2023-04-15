import { downloadEndpoint } from ".components/pages/Trinity/MessageList/download-endpoint"
import { Image } from "tamagui"

export default function ImageParagraph({ data }: Props) {
  return <Image width={200} height={200} resizeMode="contain" src={downloadEndpoint + data} />
}

interface Props {
  data: string
}
