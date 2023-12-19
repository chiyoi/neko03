import Image from 'next/image'
import Link from 'next/link'
import { Button, Flex, Heading, IconButton } from "@radix-ui/themes"
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import BackButton from '@/components/BackButton'
import { FontHachiMaruPop } from '@/modules/fonts'
import { StyleIconButton, StyleTextColor } from '@/modules/styles'
import { blurHashToDataURL } from '@/modules/blurHashDataURL'

export default function Page() {
  return (
    <>
      <BackButton />
      <Flex gap='4' align='center' direction='column' m='auto'>
        <Flex gap='2' align='center' direction='column'>
          <Image src='dotpict.png'
            alt='CHIYOI'
            placeholder='blur'
            blurDataURL={blurHashToDataURL('e8T5rnsD.%owGi${bHRqjZsQ*YbYHInmzzZ[jZ$[X8NiU4jIq+bYX%')} // cspell: disable-line
            width='366'
            height='366'
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '100%'
            }}
          />
          <Heading color='pink' className={FontHachiMaruPop.className} size='8'>CHIYOI</Heading>
        </Flex>
        <Flex gap='2'>
          <Link href='https://github.com/chiyoi'>
            <IconButton style={StyleIconButton}>
              <GitHubLogoIcon style={StyleTextColor} />
            </IconButton>
          </Link>
          <Link href='https://twitter.com/chiyoi2140'>
            <Button style={StyleIconButton}>
              <TwitterLogoIcon style={StyleTextColor} />
            </Button>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}
