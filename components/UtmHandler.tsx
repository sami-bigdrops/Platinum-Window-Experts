'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function UtmHandler() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // Helper function to set cookie
    const setCookie = (name: string, value: string, days: number = 30) => {
      try {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const cookieValue = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        document.cookie = cookieValue;
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    };

    // Read URL parameters immediately (before any URL cleaning)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source") || "";
      const utmId = urlParams.get("utm_id") || "";
      const utmS1 = urlParams.get("utm_s1") || "";

      // If URL parameters exist, store them in cookies immediately
      if (utmSource || utmId || utmS1) {
        if (utmSource) {
          setCookie('subid1', utmSource);
        }
        if (utmId) {
          setCookie('subid2', utmId);
        }
        if (utmS1) {
          setCookie('subid3', utmS1);
        }
        
        // Clean the URL by removing all query parameters and hash (after storing UTM in cookies)
        setTimeout(() => {
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }, 500);
      }
    } catch (error) {
      console.error('Error processing UTM parameters:', error);
    }
  }, [pathname])

  return null
}
