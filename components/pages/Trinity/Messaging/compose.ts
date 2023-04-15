import { ParagraphType } from ".modules/trinity"

export enum SendState {
  Composing,
  Sending,
}

export const emptyCompose = { type: ParagraphType.Text as const, text: "", sendState: SendState.Composing }

export type Compose = ({
  type: ParagraphType.Text,
  text: string,
} | {
  type: ParagraphType.Image | ParagraphType.Record | ParagraphType.Video | ParagraphType.File,
  name: string,
  data: string,
} | {
  type: ParagraphType.Unknown,
}) & {
  sendState: SendState,
}

export type StateCompose = [Compose, React.Dispatch<React.SetStateAction<Compose>>]
