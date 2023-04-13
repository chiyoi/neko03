import { useEffect, useRef, useState } from "react"

import { useWindowDimensions, Image, Square, GetProps } from "tamagui"

function styleSquare(duration: number, width: number, h: number, y: number): GetProps<typeof Square> {
  return {
    position: "absolute",
    animation: ["move", { x: { duration } }],
    enterStyle: { x: width },
    height: h,
    width: h,
    x: -h,
    y: y,
  }
}

export default function FlyingImage({ src, duration }: Props) {
  const { width, height } = useWindowDimensions()
  const [isRerender, setIsRerender] = useState(false)
  useEffect(() => setIsRerender(true), [])

  const ymin = 0.05 * height
  const ymax = 0.4 * height
  const hmin = 0.3 * height

  const { current: y } = useRef(Math.random() * (ymax - ymin) + ymin)
  const { current: h } = useRef(Math.random() * (height - y - hmin) + hmin)

  return isRerender ? (
    <Square {...styleSquare(duration, width, h, y)}>
      <Image resizeMode="contain" src={src} width={h} height={h} />
    </Square>
  ) : null
}

type Props = {
  src: string
  duration: number
}