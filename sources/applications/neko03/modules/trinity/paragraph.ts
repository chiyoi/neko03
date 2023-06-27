export enum ParagraphType {
  Text = 1,
  Image,
  Record,
  Video,
  File,
}

export type Paragraph = {
  type: ParagraphType
  data: string
}