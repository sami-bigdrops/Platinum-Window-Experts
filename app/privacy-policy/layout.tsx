import React from 'react'
import Navbar from '@/app/pwe/navbar'
import Footer from '@/app/pwe/footer'

export default function PrivacyPolicyLayout({
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
