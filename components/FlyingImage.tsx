// TODO: For future features.
import Image from 'next/image'
import { useInterval } from "@uidotdev/usehooks"
import { useMemo, useState } from "react"

export default function FlyingImage({ windowSize, src, alt, destroy }: Props) {
  const { width, height } = windowSize

  const minY = 0.05 * height
  const maxY = 0.4 * height
  const minH = 0.3 * height

  const y = useMemo(() => Math.random() * (maxY - minY) + minY, [])
  const h = useMemo(() => Math.random() * (height - y - minH) + minH, [])

  const [x, setX] = useState(width)
  useInterval(() => {
    if (x <= -h) {
      destroy()
    } else {
      setX(x - 1)
    }
  }, 10)

  return (
    <Image src={src}
      alt={alt}
      width={h}
      height={h}
      style={{
        position: 'fixed',
        objectFit: 'contain',
        left: x,
      }}
    />
  )
}

type Props = {
  windowSize: { width: number, height: number }
  src: string
  alt: string
  destroy: () => void
}
