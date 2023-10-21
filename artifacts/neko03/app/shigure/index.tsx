import { useCallback, useEffect, useRef, useState } from "react"

import { GetProps, Square, Stack, useMedia, useWindowDimensions } from "tamagui"
import { LinearGradient } from "tamagui/linear-gradient"

import Message from "./Message"
import { centralized } from ".assets/styles"

function styleAnimeQuickMove(speed: number): GetProps<typeof Square> {
  return {
    animation: ["bouncy", {
      x: {
        speed,
        bounciness: 100,
      },
    }],
    position: "absolute",
  }
}

function scaleMedia(media: ReturnType<typeof useMedia>) {
  return {
    scale: media.xs ? 0.3 : media.md ? 0.6 : media.lg ? 0.8 : 1,
  }
}

export default function Shigure() {
  const { width, height } = useWindowDimensions()
  const [isRerender, setIsRerender] = useState(false)
  useEffect(() => setIsRerender(true), [])

  const media = useMedia()

  const { current: speed } = useRef(Math.random() * 40 + 10)

  const minY = 0.1 * height
  const maxY = 0.7 * height

  const [state, setState] = useState(State.Ready)

  const x = state === State.Ready ? width + 1000 : media.xs ? -2500 : -1500
  const { current: y } = useRef(Math.random() * (maxY - minY) + minY)

  const pocchi = useCallback(() => (
    state === State.Ready ? (
      setState(State.Displaying)
    ) : state === State.Displaying && (
      setState(State.Showing)
    )
  ), [state])

  return isRerender ? (
    <LinearGradient height="100%" colors={["#EDF2F0", "#59F7B3"]} onPress={pocchi}>
      {[0, 1].includes(state) ? (
        <Square {...styleAnimeQuickMove(speed)} {...scaleMedia(media)} x={x} y={y}>
          <Message />
        </Square>
      ) : [2].includes(state) && (
        <Stack {...centralized} {...scaleMedia(media)}>
          <Message />
        </Stack>
      )}
    </LinearGradient>
  ) : null
}

enum State {
  Ready,
  Displaying,
  Showing,
}
