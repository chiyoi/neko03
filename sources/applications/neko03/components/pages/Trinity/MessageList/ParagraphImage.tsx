import { Pressable } from "react-native"

import { Image } from "tamagui"

import { config } from ".modules/config"
import { referenceUnmarshalString } from ".modules/trinity"
import { useContext, useState } from "react"
import { AuthContext, query } from ".components/pages/Trinity/auth"

const endpointDownload = new URL("/trinity/download/", config.EndpointNeko03).href

export default function ImageParagraph({ data: refString, sharing, share }: Props) {
  const auth = useContext(AuthContext)

  const uri = endpointDownload + refString
  const [ref, ok] = referenceUnmarshalString(refString)

  if (!ok) {
    return null
  }

  return (
    <>
      <Pressable disabled={sharing} onLongPress={() => share(ref.name, uri)}>
        <Image width={200} height={200} resizeMode="contain" src={{ uri: uri + "?" + query(auth) }} />
      </Pressable>
    </>
  )
}

interface Props {
  data: string,
  sharing: boolean,
  share: (filename: string, uri: string) => void,
}
