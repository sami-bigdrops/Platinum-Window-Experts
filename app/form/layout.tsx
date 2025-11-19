import React from 'react'
import type { Metadata } from 'next'
import Navbar from '@/app/pwe/navbar'
import Footer from '@/app/pwe/footer'

export const metadata: Metadata = {
  title: 'Form | Platinum Window Experts',
  icons: {
    icon: [
      { url: '/favicon.webp', type: 'image/webp', sizes: 'any' },
    ],
    shortcut: '/favicon.webp',
    apple: '/favicon.webp',
  },
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

