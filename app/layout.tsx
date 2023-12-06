import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css'

export const metadata: Metadata = {
  title: 'Neko03',
  description: 'にゃん〜',
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
