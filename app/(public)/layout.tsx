import type React from 'react'
import { Navigation } from '@/components/navigation'
import { FloatingMenuInfo } from '@/components/public/floating-menu-info'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      {children}
      <FloatingMenuInfo />
    </>
  )
}
