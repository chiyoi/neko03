export type Message = {
  sender_id: string
  content: Content
  tags: string[]

  id: string
  partition: Partition
  _ts: number

  sender_name: Name
}

export type Content = Paragraph[]

export enum Partition {
  Unknown,
  Message,
  Archived,
}

export type Paragraph = {
  type: ParagraphType
  data: string
}

export enum ParagraphType {
  Unknown,
  Text,
  Image,
  Record,
  Video,
  File,
}

type Name = {
  display_name: string
  user_principal_name: string
}

export type Reference = {
  container_name: string
  blob_name: string
}

export function ReferenceMarshal(ref: Reference) {
  if (ref.container_name.includes("/") || ref.blob_name.includes("/")) {
    throw new Error("file name should not contain slashes")
  }
  return [ref.container_name, ref.blob_name].join("/")
}

export function ReferenceUnmarshal(data: string) {
  const ss = data.split("/")
  if (ss.length !== 2) {
    return new Error("format error")
  }
  return {
    container_name: ss[0],
    blob_name: ss[1],
  } as Reference
}

export function text(s: string): Paragraph {
  return {
    type: ParagraphType.Text,
    data: s,
  }
}

export function image(ref: Reference): Paragraph {
  return {
    type: ParagraphType.Image,
    data: ReferenceMarshal(ref),
  }
}