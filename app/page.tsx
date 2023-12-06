'use client'
import Image from 'next/image'
import { Flex, Heading, Text, Button } from '@radix-ui/themes'
import Link from 'next/link'
import { FontHachiMaruPop } from '@/fonts'
import { StyleButtonColor } from '@/styles'

const title = colorLoopCharacters("neko03★moe")
const pages: Page[] = [
  {
    title: 'Chiyoi',
    href: '/chiyoi',
    avatarSrc: 'https://files.neko03.moe/assets/IMG_0306.jpeg',
  }, {
    title: 'Nacho',
    href: '/nacho',
    avatarSrc: 'https://files.neko03.moe/assets/nacho.png',
  }, {
    title: 'Shigure',
    href: '/shigure',
    avatarSrc: 'https://files.neko03.moe/assets/shigure.png',
  },
]

export default function Page() {
  return (
    <>
      <Flex m='3' position='fixed' gap='1' direction='column' style={{ width: '20vh' }}>
        {pages.map(page =>
          <Link href={page.href}>
            <Button key={page.title}
              style={{
                ...StyleButtonColor,
                borderRadius: 'var(--radius-6)'
              }}>
              {page.avatarSrc !== undefined && <Image src={page.avatarSrc}
                alt={page.title}
                width='20'
                height='20'
                style={{
                  borderRadius: 'var(--radius-5)'
                }}
              />}
              <Text color='pink' className={FontHachiMaruPop.className}>{page.title}</Text>
            </Button>
          </Link>
        )}
      </Flex>

      <Flex gap='2' align='center' direction='column' m='auto'>
        <Image src='https://files.neko03.moe/assets/cat_girl__cute__loli_1231998692.png'
          alt='Neko03'
          width='320'
          height='160'
          style={{
            maskImage: 'linear-gradient(transparent, black, transparent)',
            WebkitMaskImage: 'linear-gradient(transparent, black, transparent)',
            borderRadius: 'var(--radius-2)'
          }}
        />
        <Heading>
          {title.map((c, i) => (
            <Text key={i}
              className={FontHachiMaruPop.className}
              style={{ color: `var(--${c.color}-8)` }}
              size={c.char === '★' ? {
                initial: '1',
                sm: '3',
              } : {
                initial: '8',
                sm: '9',
              }}>
              {c.char}
            </Text>
          ))}
        </Heading>
      </Flex>
    </>
  )
}

function colorLoopCharacters(s: string): ColoredCharacter[] {
  function loop(a: any[], i: number) {
    return () => a[i++ % a.length]
  }
  const color = loop(["pink", "blue", "yellow", "green"], 1)
  return [...s].map(c => { return { char: c, color: color() } })
}

type ColoredCharacter = {
  char: string,
  color: 'pink' | 'blue' | 'yellow' | 'green',
}

type Page = {
  title: string,
  href: string,
  avatarSrc?: string,
}
