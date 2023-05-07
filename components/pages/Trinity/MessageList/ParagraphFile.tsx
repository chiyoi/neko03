import { Platform } from "react-native"
import { Link } from "expo-router"

import { Button, GetProps } from "tamagui"

import { referenceUnmarshalString } from ".modules/trinity"
import { config } from ".modules/config"
import { useContext } from "react"
import { AuthContext, query } from ".components/pages/Trinity/auth"

const downloadEndpoint = new URL("/trinity/download/", config.EndpointService).href

const styleButton: GetProps<typeof Button> = {
  color: "$color8",
  marginEnd: "auto",
}

export default function FileParagraph({ data: refString, sharing, share }: Props) {
  const auth = useContext(AuthContext)

  const [ref, ok] = referenceUnmarshalString(refString)
  const uri = downloadEndpoint + refString

  if (!ok) {
    return <Button {...styleButton} disabled>(invalid file~)</Button>
  }

  return Platform.OS === "ios" ? (
    <Button {...styleButton} disabled={sharing} onPress={() => share(ref.name, uri)}>
      {ref.name}
    </Button>
  ) : null
}

interface Props {
  data: string,
  sharing: boolean,
  share: (filename: string, uri: string) => void,
}
