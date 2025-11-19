import React from 'react'
import Navbar from '@/app/pwe/navbar'
import Footer from '@/app/pwe/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thank You | Platinum Window Experts',
}

export default function ThankYouLayout({
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
