import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { IconButton } from "@radix-ui/themes"
import { StyleIconButton, StyleTextColor } from "@/modules/styles"

export default function BackButton() {
  return (
    <Link href='/'>
      <IconButton m='3' style={{
        ...StyleIconButton,
        position: 'fixed',
      }}>
        <ChevronLeftIcon style={StyleTextColor} />
      </IconButton>
    </Link>
  )
}
