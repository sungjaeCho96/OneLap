import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OneLap — 모터스포츠 정보 통합 사이트',
  description: '모두가 하나 되는, 한 바퀴. F1·WEC·WRC·슈퍼레이스·현대 N을 한곳에서.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
