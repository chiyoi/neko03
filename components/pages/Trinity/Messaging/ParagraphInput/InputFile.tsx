import { useCallback } from "react"
import { getDocumentAsync } from "expo-document-picker"

import { Button, XStack } from "tamagui"
import { X } from "@tamagui/lucide-icons"

import { iconButton } from ".assets/styles"

export default function InputFile({ nameState: [name, setName], dataState: [file, setFile] }: Props) {
  const clear = useCallback(() => {
    setName("")
    setFile("")
  }, [])

  return (
    <XStack>
      <Button color="$color8" onPress={() => pickFile(setName, setFile)}>{name || "Choose File"}</Button>
      {file && (
        <Button {...iconButton} width={45} chromeless onPress={clear}>
          <X color="$color8" />
        </Button>
      )}
    </XStack>
  )
}

async function pickFile(setName: StateString[1], setFile: StateString[1]) {
  const resp = await getDocumentAsync()
  if (resp.type === "success") {
    setName(resp.name)
    setFile(resp.uri)
  }
}

interface Props {
  nameState: StateString,
  dataState: StateString,
}

type StateString = [string, (s: string) => void]
