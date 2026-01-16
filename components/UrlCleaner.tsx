'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const EXCLUDED_PATHS = ['/thankyou', '/privacy-policy', '/terms-of-use', '/form']

export default function UrlCleaner() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't clean URLs for excluded paths
    if (EXCLUDED_PATHS.includes(pathname)) {
      return
    }

    // Clean URL by removing query parameters and hash fragments
    if (typeof window !== 'undefined') {
      const hasQueryParams = window.location.search.length > 0
      const hasHash = window.location.hash.length > 0

      if (hasQueryParams || hasHash) {
        const cleanUrl = 
          window.location.protocol + 
          '//' + 
          window.location.host + 
          window.location.pathname
        
        window.history.replaceState({}, document.title, cleanUrl)
      }
    }
  }, [pathname])

  return null
}
