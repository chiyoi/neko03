import { useEffect, useRef, useState } from "react"

import { useWindowDimensions, Square, GetProps, Image } from "tamagui"

export default function FlyingImage({ uri, duration }: Props) {
  const { width, height } = useWindowDimensions()
  const [isRerender, setIsRerender] = useState(false)
  useEffect(() => setIsRerender(true), [])

  const minY = 0.05 * height
  const maxY = 0.4 * height
  const minH = 0.3 * height

  const { current: y } = useRef(Math.random() * (maxY - minY) + minY)
  const { current: h } = useRef(Math.random() * (height - y - minH) + minH)

  if (!isRerender) {
    return null
  }

  return (
    <Square position="absolute" animation={["move", { x: { duration } }]} enterStyle={{ x: width }} height={h} width={h} x={-h} y={y}>
      <Image resizeMode="contain" source={{ uri, width: h, height: h }} />
    </Square>
  )
}

type Props = {
  uri: string
  duration: number
}