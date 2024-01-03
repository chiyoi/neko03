import Link from "next/link"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { IconButton } from "@radix-ui/themes"

export default () => (
  <Link href='/'>
    <IconButton variant='soft' m='3' style={{
      width: '40px',
      height: '40px',
      borderRadius: '100%',
      position: 'fixed',
    }}>
      <ChevronLeftIcon style={{
      }} />
    </IconButton>
  </Link >
)
