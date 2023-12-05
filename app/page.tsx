'use client'
import { Flex, Heading, Theme, Text, Button } from '@radix-ui/themes'
import { Hachi_Maru_Pop } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

const fontHachiMaruPop = Hachi_Maru_Pop({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

export default function Page() {
  const title = colorLoopCharacters("neko03★moe")
  const pages: Page[] = [
    {
      title: 'chiyoi',
      href: '/chiyoi',
    }, {
      title: 'nacho',
      href: '/nacho',
    }, {
      title: 'shigure',
      href: '/shigure',
    },
  ]
  return (
    <ThemeProvider attribute='class'>
      <Theme accentColor='pink'>
        <Flex p='3' style={{ height: '100vh', backgroundColor: 'var(--accent-4)' }}>
          <Flex direction='column'>
            {/* Navigation Menu */}
            <Button>
              <Text>Nyan</Text>
            </Button>
          </Flex>
          <Flex m='auto'>
            <Heading>
              {title.map((c, i) => (
                <Text className={fontHachiMaruPop.className} style={{ color: `var(--${c.color}-8)` }} key={i} size={c.char === '★' ? {
                  initial: '1',
                  sm: '3',
                } : {
                  initial: '7',
                  sm: '9',
                }}>
                  {c.char}
                </Text>
              ))}
            </Heading>
          </Flex>
        </Flex>
      </Theme>
    </ThemeProvider>
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

  star?: boolean,
}

type Page = {
  title: string,
  href: string,
  avatar?: string,
}
