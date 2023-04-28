import { Platform } from "react-native"
import { Link } from "expo-router"
import { shareAsync } from "expo-sharing"
import { documentDirectory, downloadAsync } from "expo-file-system"

import { Button, GetProps } from "tamagui"

import { referenceUnmarshalString } from ".modules/trinity"
import { config } from ".modules/config"
import { useState } from "react"

const downloadEndpoint = new URL("/trinity/download/", config.EndpointService()).href

const styleButton: GetProps<typeof Button> = {
  color: "$color8",
  marginEnd: "auto",
}

export default function FileParagraph({ data: refString }: Props) {
  const [ref, ok] = referenceUnmarshalString(refString)
  const [downloading, setDownloading] = useState(false)

  if (!ok) {
    return <Button disabled>(invalid file~)</Button>
  }

  return Platform.OS === "web" ? (
    <Link asChild href={downloadEndpoint + refString}>
      <Button>{ref.name}</Button>
    </Link>
  ) : Platform.OS === "ios" ? (
    <Button {...styleButton} disabled={downloading} onPress={() => download(refString, ref.name, setDownloading)}>
      {ref.name}
    </Button>
  ) : null
}

async function download(refString: string, filename: string, setDownloading: (downloading: boolean) => void) {
  const file = documentDirectory + filename
  console.log(`downloading ${filename}`)
  setDownloading(true)
  await downloadAsync(downloadEndpoint + refString, file)
  await shareAsync(file)
  setDownloading(false)
}

interface Props {
  data: string,
}
