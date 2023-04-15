import { iconButton } from ".assets/styles"
import { StateCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphType } from ".modules/trinity"
import { X } from "@tamagui/lucide-icons"
import { getDocumentAsync } from "expo-document-picker"
import { readAsStringAsync } from "expo-file-system"
import { useCallback, useState } from "react"
import { Platform } from "react-native"
import { Button, XStack } from "tamagui"

export default function InputFile({ nameState: [name, setName], dataState: [file, setFile] }: Props) {
  const clear = useCallback(() => {
    setName("")
    setFile("")
  }, [])
  console.debug(name)
  console.debug(file.length)

  return (
    <XStack>
      <Button onPress={() => pickFile(setName, setFile)}>{name || "Choose File"}</Button>
      <Button {...iconButton} chromeless onPress={clear}><X /></Button>
    </XStack>
  )
}

type StateString = [string, (s: string) => void]
async function pickFile(setName: StateString[1], setFile: StateString[1]) {
  const resp = await getDocumentAsync()
  if (resp.type === "success") {
    if (Platform.OS === "web" && resp.file !== undefined) {
      setFile(await resp.file.text())
    } else if (Platform.OS === "ios") {
      setFile(await readAsStringAsync(resp.uri))
    }
    setName(resp.name)
  }
}

interface Props {
  nameState: StateString,
  dataState: StateString,
}
