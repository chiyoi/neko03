'use client'
import { Box, Flex, Theme } from "@radix-ui/themes"
import { ThemeProvider } from "next-themes"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class'>
      <Theme accentColor='pink'>
        <Flex style={{ height: '100vh', backgroundColor: 'var(--accent-2)' }}>
          {children}
        </Flex>
      </Theme>
    </ThemeProvider>
  )
}
