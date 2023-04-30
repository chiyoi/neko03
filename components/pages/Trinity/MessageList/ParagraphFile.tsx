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

export default function FileParagraph({ data: refString, sharing, share }: Props) {
  const [ref, ok] = referenceUnmarshalString(refString)

  if (!ok) {
    return <Button disabled>(invalid file~)</Button>
  }

  return Platform.OS === "web" ? (
    <Link asChild href={downloadEndpoint + refString}>
      <Button>{ref.name}</Button>
    </Link>
  ) : Platform.OS === "ios" ? (
    <Button {...styleButton} disabled={sharing} onPress={() => share(refString, ref.name)}>
      {ref.name}
    </Button>
  ) : null
}

interface Props {
  data: string,
  sharing: boolean,
  share: (filename: string, uri: string) => void,
}
