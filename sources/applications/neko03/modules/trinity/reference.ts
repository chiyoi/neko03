export type Reference = {
  name: string,
  id: string,
}

export function referenceUnmarshalString(s: string): [Reference, true] | [undefined, false] {
  const ss = s.split("/")
  if (ss.length === 2) {
    return [{
      name: ss[0],
      id: ss[1],
    }, true]
  }
  return [undefined, false]
}

export function referenceMarshalString(ref: Reference): string {
  return [ref.name, ref.id].join("/")
}
