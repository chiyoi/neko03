import Image from 'next/image'
import Link from 'next/link'
import { Button, Flex, Heading, IconButton } from "@radix-ui/themes"
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import { FontHachiMaruPop } from '@/fonts'
import { StyleIconButton, StyleTextColor } from '@/styles'
import BackButton from '@/components/BackButton'
import { blurHashToDataURL } from '@/blurHashDataURL'

export default function Page() {
  return (
    <>
      <BackButton />
      <Flex gap='4' align='center' direction='column' m='auto'>
        <Flex gap='2' align='center' direction='column'>
          <Image src='https://files.neko03.moe/assets/IMG_0306.jpeg'
            alt='CHIYOI'
            placeholder='blur'
            blurDataURL={blurHashToDataURL('eDS_$1s:.#nlJ$-4fiK7e=v}z4f6P^kAsDIge=,*f~KRy2f7M,fkxa')} // cspell: disable-line
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
