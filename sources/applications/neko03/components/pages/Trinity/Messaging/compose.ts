import { ParagraphType } from ".modules/trinity"

export const emptyText: ComposeText = { type: ParagraphType.Text, text: "" }
export const emptyFile: ComposeReference = { type: ParagraphType.File, filename: "", uri: "" }

export type ComposeText = {
  type: ParagraphType.Text,
  text: string,
}

export type ComposeReference = {
  type: ParagraphType.Image | ParagraphType.Record | ParagraphType.Video | ParagraphType.File,
  filename: string,
  uri: string,
}

export type Compose = ComposeText | ComposeReference

export type StateCompose = [Compose, React.Dispatch<React.SetStateAction<Compose>>]
export type StateComposeReference = [ComposeReference, React.Dispatch<React.SetStateAction<Compose>>]
