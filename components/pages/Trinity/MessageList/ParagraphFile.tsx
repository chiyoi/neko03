import { downloadEndpoint } from ".components/pages/Trinity/MessageList/download-endpoint"
import { Reference, unmarshalReferenceString } from ".modules/trinity"
import { documentDirectory, downloadAsync } from "expo-file-system"
import { Link } from "expo-router"
import { shareAsync } from "expo-sharing"
import { Platform } from "react-native"
import { Button } from "tamagui"

export default function FileParagraph({ data: refString }: Props) {
  const [ref, ok] = unmarshalReferenceString(refString)

  if (!ok) {
    return <Button disabled>(invalid file~)</Button>
  }

  return Platform.OS === "web" ? (
    <Link asChild href={downloadEndpoint + refString}>
      <Button>{ref.name}</Button>
    </Link>
  ) : Platform.OS === "ios" ? (
    <Button onPress={() => download(refString, ref.name)}>{ref.name}</Button>
  ) : (
    <Button disabled>(invalid platform~)</Button>
  )
}

async function download(refString: string, filename: string) {
  const file = documentDirectory + filename
  await downloadAsync(downloadEndpoint + refString, file)
  shareAsync(file)
}

interface Props {
  data: string,
}
