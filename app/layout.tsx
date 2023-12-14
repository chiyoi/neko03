import type { Metadata, Viewport } from 'next'
import '@radix-ui/themes/styles.css'

export const metadata: Metadata = {
  title: 'Neko03',
  description: 'にゃん〜',
  icons: {
    shortcut: 'https://neko03.moe/favicon.icl',
    icon: 'https://neko03.moe/favicon.ico',
    apple: 'https://neko03.moe/favicon.ico',
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
