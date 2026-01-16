import React from 'react'
import type { Metadata } from 'next'
import Navbar from '@/app/pwe/navbar'
import Footer from '@/app/pwe/footer'

export const metadata: Metadata = {
  title: 'Form | Platinum Window Experts',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: 'any' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
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

