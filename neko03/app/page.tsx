import { Button, Container, Flex, Text } from '@radix-ui/themes'
import { Hachi_Maru_Pop } from 'next/font/google'

const hachiMaruPop = Hachi_Maru_Pop({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

export default function Home() {
  return (
    <Container size='1'>
      <Flex direction='column' gap='2'>
        <Text className={hachiMaruPop.className}>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>
    </Container>
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
  color: string,

  star?: boolean,
}

type Page = {
  title: string,
  href: string,
  avatar?: string,
}
