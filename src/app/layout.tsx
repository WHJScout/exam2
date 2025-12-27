import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Massed Learning vs Spaced Learning',
  description: 'Massed Learning vs Spaced Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  )
}
