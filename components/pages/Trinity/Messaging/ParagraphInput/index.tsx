import { Input } from "tamagui"

import InputFile from ".components/pages/Trinity/Messaging/ParagraphInput/InputFile"
import { StateCompose } from ".components/pages/Trinity/Messaging/compose"
import { ParagraphType } from ".modules/trinity"

export function ParagraphInput({ composeState: [compose, setCompose] }: Props) {
  return compose.type === ParagraphType.Text ? (
    <Input flex={1} value={compose.text} onChangeText={text => setCompose({ ...compose, text })} />
  ) : compose.type === ParagraphType.File ? (
    <InputFile composeState={[compose, setCompose]} />
  ) : null
}

interface Props {
  composeState: StateCompose,
}
