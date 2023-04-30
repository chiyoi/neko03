import { config } from ".modules/config"
import { referenceUnmarshalString } from ".modules/trinity"
import { Toast } from "@tamagui/toast"
import { documentDirectory, downloadAsync } from "expo-file-system"
import { shareAsync } from "expo-sharing"
import React, { useState } from "react"
import { Pressable } from "react-native"
import { Image } from "tamagui"

const endpointDownload = new URL("/trinity/download/", config.EndpointService()).href

export default function ImageParagraph({ data: refString, sharing, share }: Props) {
  const uri = endpointDownload + refString
  const [ref, ok] = referenceUnmarshalString(refString)

  if (!ok) {
    return null
  }

  return (
    <>
      <Pressable disabled={sharing} onLongPress={() => share(ref.name, uri)}>
        <Image width={200} height={200} resizeMode="contain" src={{ uri }} />
      </Pressable>
    </>
  )
}

interface Props {
  data: string,
  sharing: boolean,
  share: (filename: string, uri: string) => void,
}
