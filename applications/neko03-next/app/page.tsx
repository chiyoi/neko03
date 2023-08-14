import React from "react"

const title = "neko03★moe"

export default function Neko03() {
  const cs = colorLoopCharacters(title)

  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

function colorLoopCharacters(s: string): ColoredCharacter[] {
  const color = loop(["pink", "blue", "yellow", "green"], 1)
  return [...s].map(c => { return { char: c, color: color() } })
}

function loop(a: any[], i: number) {
  return () => a[i++ % a.length]
}

type ColoredCharacter = {
  char: string,
  color: string,

  star?: boolean,
}

type Page = {
  title: string,
  href: string,
  avatar?: string,
}
