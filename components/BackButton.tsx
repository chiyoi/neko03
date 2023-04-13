import { Link } from "expo-router"

import { Button, GetProps } from "tamagui"
import { ChevronLeft } from "@tamagui/lucide-icons"

import { topLeftIconButton } from ".assets/styles"

const styleIcon: GetProps<typeof Button> = {
  icon: <ChevronLeft size={30} />,
}

export default function BackButton() {
  return (
    <Link asChild href="/">
      <Button {...topLeftIconButton} {...styleIcon} />
    </Link>
  )
}