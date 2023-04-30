import { Link } from "expo-router"

import { Button } from "tamagui"
import { ChevronLeft } from "@tamagui/lucide-icons"

import { styleTopLeftIconButton } from ".assets/styles"

export default function BackButton() {
  return (
    <Link asChild href="/">
      <Button {...styleTopLeftIconButton} chromeless icon={
        <ChevronLeft size={30} />
      } />
    </Link>
  )
}