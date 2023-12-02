import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'


export const metadata: Metadata = {
  title: 'Neko03',
  description: 'にゃん〜',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Theme accentColor='ruby'>
          {children}
        </Theme>
      </body>
    </html>
  )
}
