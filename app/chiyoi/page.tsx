'use client'
import Image from 'next/image'
import { Button, Flex, Heading, IconButton } from "@radix-ui/themes"
import { ChevronLeftIcon, GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import { FontHachiMaruPop } from '@/fonts'
import Link from 'next/link'
import { StyleIconButton, StyleTextColor } from '@/styles'

export default function Page() {
  return (
    <>
      <Link href='/'>
        <IconButton m='3' style={{
          ...StyleIconButton,
          position: 'fixed',
        }}>
          <ChevronLeftIcon style={StyleTextColor} />
        </IconButton>
      </Link>
      <Flex gap='4' align='center' direction='column' m='auto'>
        <Flex gap='2' align='center' direction='column'>
          <Image src='https://files.neko03.moe/assets/IMG_0306.jpeg'
            alt='CHIYOI'
            width='128'
            height='128'
            style={{
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