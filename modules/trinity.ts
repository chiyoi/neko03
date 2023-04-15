export const InvalidReferenceString = "(invalid reference~)"

export type Message = {
  sender_id: string
  content: Paragraph[]
  tags: string[]

  id: string
  partition: Partition
  _ts: number
}

export enum Partition {
  Unknown,
  Active,
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

export type Name = {
  display_name: string,
  user_principal_name: string,
}

export type Reference = {
  name: string,
  digest: string,
}

export function unmarshalReferenceString(s: string): [Reference, true] | [undefined, false] {
  const ss = s.split("/")
  if (ss.length === 2) {
    return [{
      name: ss[0],
      digest: ss[1],
    }, true]
  }
  return [undefined, false]
}

export function marshalReferenceString(ref: Reference): string {
  return [ref.name, ref.digest].join("/")
}
