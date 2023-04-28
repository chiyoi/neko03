import { Input } from "tamagui"

import InputFile from ".components/pages/Trinity/Messaging/ParagraphInput/InputFile"
import { StateCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphType } from ".modules/trinity"

export function ParagraphInput({ composeState }: Props) {
  const [compose, setCompose] = composeState

  return compose.type === ParagraphType.Text ? (
    <Input flex={1} value={compose.text} onChangeText={v => setCompose({ ...compose, text: v })} />
  ) : compose.type === ParagraphType.File ? (
    <InputFile
      nameState={[compose.name, (name: string) => setCompose(compose => { return { ...compose, name } })]}
      dataState={[compose.data, (data: string) => setCompose(compose => { return { ...compose, data } })]}
    />
  ) : null
}

interface Props {
  composeState: StateCompose,
}
