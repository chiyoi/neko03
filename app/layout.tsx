import type { Metadata, Viewport } from 'next'
import '@radix-ui/themes/styles.css'

export const metadata: Metadata = {
  title: 'Neko03',
  description: 'にゃん〜',
  icons: {
    icon: 'https://files.neko03.moe/assets/cat_girl__cute__loli_2979261983.png',
    shortcut: 'https://files.neko03.moe/assets/cat_girl__cute__loli_2979261983.png',
    apple: 'https://files.neko03.moe/assets/cat_girl__cute__loli_2979261983.png',
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBDCEF' },
    { media: '(prefers-color-scheme: dark)', color: '#4B143D' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
