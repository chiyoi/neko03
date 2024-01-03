import type { Metadata, Viewport } from 'next'
import '@radix-ui/themes/styles.css'

export const metadata: Metadata = {
  title: 'Neko03',
  description: 'にゃん〜',
  icons: {
    icon: '/favicon.ico',
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FEF7FB' },
    { media: '(prefers-color-scheme: dark)', color: '#21121D' },
  ],
}

export default ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body style={{ margin: 0 }}>
      {children}
    </body>
  </html>
)
