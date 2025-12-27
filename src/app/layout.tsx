import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '词汇学习实验系统',
  description: 'Massed Learning vs Spaced Learning 词汇习得效果研究',
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
