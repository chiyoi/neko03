import { useCallback } from "react"
import { getDocumentAsync } from "expo-document-picker"

import { Button, XStack } from "tamagui"
import { X } from "@tamagui/lucide-icons"

import { styleIconButton } from ".assets/styles"
import { StateComposeReference, emptyFile } from ".components/pages/Trinity/Messaging/compose"

export default function InputFile({ composeState: [compose, setCompose] }: Props) {
  const pickFile = useCallback(async () => {
    const resp = await getDocumentAsync()
    if (resp.type === "success") {
      setCompose(compose => { return { ...compose, filename: resp.name, uri: resp.uri } })
    }
  }, [])

  return (
    <XStack>
      <Button color="$color8" onPress={pickFile}>{compose.filename || "Choose File"}</Button>

      {compose.filename !== "" && (
        <Button {...styleIconButton} width={45} chromeless onPress={() => setCompose(emptyFile)}>
          <X color="$color8" />
        </Button>
      )}
    </XStack >
  )
}

interface Props {
  composeState: StateComposeReference,
}
