import { useCallback, useEffect, useRef, useState } from "react"

import { GetProps, Square, Stack, useMedia, useWindowDimensions } from "tamagui"
import { LinearGradient } from "tamagui/linear-gradient"

import Message from "./Message"
import { centralized } from ".assets/styles"

const styleBackground: GetProps<typeof LinearGradient> = {
  height: "100%",
  colors: ["#EDF2F0", "#59F7B3"]
}

function styleMessageSquare(speed: number): GetProps<typeof Square> {
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

function scaleMedia(media: { xs?: boolean, sm?: boolean }) {
  return {
    scale: media.xs ? 0.3 : media.sm ? 0.6 : 1,
  }
}

export default function Shigure() {
  const { width, height } = useWindowDimensions()
  const [isRerender, setIsRerender] = useState(false)
  useEffect(() => setIsRerender(true), [])

  const media = useMedia()

  const { current: speed } = useRef(Math.random() * 100)

  const ymin = 0.1 * height
  const ymax = 0.7 * height

  const [state, setState] = useState(State.Ready)

  const x = state === State.Ready ? width : media.xs ? -2500 : -1500
  const { current: y } = useRef(Math.random() * (ymax - ymin) + ymin)

  const pocchi = useCallback(() => (
    state === State.Ready ? (
      setState(State.Displaying)
    ) : state === State.Displaying && (
      setState(State.Showing)
    )
  ), [state])

  return isRerender ? (
    <LinearGradient {...styleBackground} onPress={pocchi}>
      {[0, 1].includes(state) ? (
        <Square {...styleMessageSquare(speed)} {...scaleMedia(media)} x={x} y={y}>
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