import axios from "axios"
import { useCallback, useEffect, useState } from "react"

import { Stack } from "tamagui"

import { handle } from ".modules/axios_utils"
import FlyingImage from "./FlyingImage"
import BackButton from ".components/BackButton"
import { config } from ".modules/config"

export default function Nacho() {
  const interval = 20000
  const duration = 50000

  const serviceEndpoint = config.EndpointService()
  const imageListEndpoint = new URL("/nacho/image_list.json", serviceEndpoint).href

  const [imageList, setImageList] = useState<string[]>([])
  useEffect(() => { fetchImageList(imageListEndpoint, setImageList) }, [imageListEndpoint])

  const [images, setImages] = useState<string[]>([])
  const removeImage = useCallback((id: string) => setImages(images => images.filter(image => image !== id)), [])
  const addImage = useCallback(() => {
    if (imageList.length > 0) {
      setImages(images => {
        const m = new Set()
        images.forEach(image => m.add(image))

        const image = pick(imageList.filter(image => !m.has(image)))
        setTimeout(() => removeImage(image), duration)

        return [...images, image]
      })
    }
  }, [imageList])

  useEffect(() => {
    if (imageList.length > 0) {
      addImage()
      const worker = setInterval(addImage, interval)
      return () => {
        setImages([])
        clearInterval(worker)
      }
    }
  }, [imageList, addImage])

  return (
    <>
      <Stack height="100%" backgroundColor="$background">
        {images.map(image => (
          <FlyingImage key={image} src={new URL(image, serviceEndpoint).href} duration={duration} />
        ))}
      </Stack>

      <BackButton />
    </>
  )
}

function pick(imageList: string[]): string {
  return imageList.length > 0 ? imageList[Math.floor(Math.random() * imageList.length)] : "なちょ逃げた"
}

async function fetchImageList(imageListEndpoint: string, setImageList: (imageList: string[]) => void) {
  try {
    console.debug(imageListEndpoint)
    const resp = await axios.get<string[]>(imageListEndpoint)
    setImageList(resp.data)
  } catch (err) {
    handle(err)
  }
}
