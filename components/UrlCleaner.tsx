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
    // Add a delay to allow UTM parameter storage to happen first (especially on home page)
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined') {
        // Check if there are UTM parameters - if so, wait a bit longer for them to be stored
        const urlParams = new URLSearchParams(window.location.search);
        const hasUtmParams = urlParams.has('utm_source') || urlParams.has('utm_id') || urlParams.has('utm_s1');
        
        // If UTM params exist, wait a bit more before cleaning to ensure they're stored in cookies
        if (hasUtmParams) {
          setTimeout(() => {
            const cleanUrl = 
              window.location.protocol + 
              '//' + 
              window.location.host + 
              window.location.pathname
            
            window.history.replaceState({}, document.title, cleanUrl)
          }, 400);
        } else {
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
      }
    }, 100); // Initial delay to let UTM storage run first

    return () => clearTimeout(timeoutId);
  }, [pathname])

  return null
}
