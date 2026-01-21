'use client'

import React, { useEffect, useState, Suspense, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useSearchParams } from 'next/navigation'

// Control whether to verify thank you page token
// Set to false for development to skip verification
const doVerifyThankYouPage = true

const ads = [
  {
    image: '/2.png',
    link: 'https://www.platinum-home-track.com/28KL6/49FHNSP/?uid=115&sub1=pwe_${utm_source}&sub2=${utm_id}'
  },
  {
    image: '/3.jpg',
    link: 'https://www.platinum-home-track.com/28KL6/49FHNSP/?uid=113&sub1=pwe_${utm_source}&sub2=${utm_id}'
  }
]

interface UtmParams {
  utm_source: string
  utm_id: string
  utm_s1: string
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [utmParams, setUtmParams] = useState<UtmParams>({
    utm_source: '',
    utm_id: '',
    utm_s1: ''
  })
  const [emailSent, setEmailSent] = useState(false)
  // const [buyer, setBuyer] = useState<string | null>(null)
  const [hasProcessedUrl, setHasProcessedUrl] = useState(false)
  const emailSentRef = React.useRef(false)


  // Function to send welcome email from thank you page
  const sendWelcomeEmailFromThankYou = useCallback(async () => {
    try {
      // Get email from URL parameters (passed from form submission)
      const emailFromUrl = searchParams.get('email');
      
      // Fallback to localStorage if URL parameter not available
      const windowsFormData = localStorage.getItem('windows_form_data');
      const emailFromStorage = windowsFormData ? JSON.parse(windowsFormData).email : null;
      
      const email = emailFromUrl || emailFromStorage;
      
      if (!email) {
        return;
      }
      
      // Prevent duplicate email sends
      if (emailSent || emailSentRef.current) {
        console.log('Email already sent, skipping duplicate send');
        return;
      }
      
      emailSentRef.current = true;
      
      console.log('Sending welcome email to:', email);
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase()
        })
      });
      
      const result = await response.json();
      console.log('Email API response:', result);
      
      if (response.ok && result.success) {
        setEmailSent(true);
        console.log('Email sent successfully');
      } else {
        console.error('Failed to send email:', result.error || 'Unknown error');
        emailSentRef.current = false; // Reset on failure to allow retry
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }, [searchParams, emailSent]);

  // Protection useEffect - runs first to check access authorization
  useEffect(() => {
    // Prevent multiple runs
    if (hasProcessedUrl) return;
    
    const checkAccess = async () => {
      try {
        // If verification is disabled, allow access immediately (useful for development)
        if (!doVerifyThankYouPage) {
          setIsAuthorized(true);
          setIsLoading(false);
          setHasProcessedUrl(true);
          
          // Get buyer from URL if available
          // const buyerFromUrl = searchParams.get('buyer');
          
          // if (buyerFromUrl) {
          //   setBuyer(buyerFromUrl);
          // }
          
          // Clean URL by removing query parameters after extracting the data
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          }, 100);
          
          // Send welcome email after a short delay to ensure page is loaded
          setTimeout(() => {
            if (!emailSent) {
              sendWelcomeEmailFromThankYou();
            }
          }, 500);
          return;
        }

        // Check if user came from webhook (has email parameter)
        const emailFromUrl = searchParams.get('email');
        // const buyerFromUrl = searchParams.get('buyer');
        
        if (emailFromUrl) {
          // User came from webhook or form submission with email - allow access
          setIsAuthorized(true);
          setIsLoading(false);
          setHasProcessedUrl(true);
          
          // Set buyer from URL parameters
          // if (buyerFromUrl) {
          //   setBuyer(buyerFromUrl);
          // }
          
          // Clean URL by removing query parameters after extracting the data
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
          }, 100);
          
          // Send welcome email after a short delay to ensure page is loaded
          setTimeout(() => {
          if (!emailSent) {
            sendWelcomeEmailFromThankYou();
          }
          }, 500);
          return;
        }

        // Check for access token in localStorage (for direct access)
        const token = localStorage.getItem('thankyou_token');
        const expiresAt = localStorage.getItem('thankyou_expires');

        if (!token || !expiresAt) {
          router.replace('/');
          return;
        }

        // Check if token has expired
        const currentTime = Date.now();
        const tokenExpiry = parseInt(expiresAt, 10);
        
        if (currentTime > tokenExpiry) {
          localStorage.removeItem('thankyou_token');
          localStorage.removeItem('thankyou_expires');
          router.replace('/');
          return;
        }

        // Validate token against server (optional additional security check)
        try {
          const response = await fetch('/api/validate-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          
          if (!response.ok) {
            throw new Error('Token validation failed');
          }
        } catch {
          // If validation endpoint doesn't exist or fails, we'll rely on localStorage validation
        }

        // All checks passed - authorize access
        setIsAuthorized(true);
        
        // Clear the token to prevent reuse (one-time access)
        localStorage.removeItem('thankyou_token');
        localStorage.removeItem('thankyou_expires');
        
        // Send welcome email after a short delay to ensure page is loaded
        setTimeout(() => {
        if (!emailSent) {
          sendWelcomeEmailFromThankYou();
        }
        }, 500);
      } catch {
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router, emailSent, sendWelcomeEmailFromThankYou, hasProcessedUrl, searchParams]);

  useEffect(() => {
    // Skip UTM parameter processing if not authorized
    if (!isAuthorized) return;

    // Helper function to get cookie value
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
      return '';
    };

    // Helper function to set cookie
    const setCookie = (name: string, value: string, days: number = 30) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    // Get UTM parameters from URL
    const utm_source = searchParams.get('utm_source') || ''
    const utm_id = searchParams.get('utm_id') || ''
    const utm_s1 = searchParams.get('utm_s1') || ''

    // If URL parameters exist, use them and save to cookies
    if (utm_source || utm_id || utm_s1) {
      if (utm_source) setCookie('subid1', utm_source);
      if (utm_id) setCookie('subid2', utm_id);
      if (utm_s1) setCookie('subid3', utm_s1);
      
      setUtmParams({ utm_source, utm_id, utm_s1 })
    } else {
      // If no URL parameters, try to read from cookies
      const cookieUtmSource = getCookie('subid1') || '';
      const cookieUtmId = getCookie('subid2') || '';
      const cookieUtmS1 = getCookie('subid3') || '';
      
      setUtmParams({
        utm_source: cookieUtmSource,
        utm_id: cookieUtmId,
        utm_s1: cookieUtmS1
      })
    }
  }, [searchParams, isAuthorized])

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Show nothing if not authorized (redirect is in progress)
  if (!isAuthorized) {
    return null;
  }

  return (
    <main>
      {/* Thank You Section */}
      <section id="thankyou" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="thankyou-content text-center">
            <div className="mb-8">
            </div>
            <h3 className="text-5xl font-bold text-sky-800 mb-12">
              Thank you!
            </h3>

            {/* Show buyer logo only if buyer is known and not empty */}
            {/* {buyer && buyer.trim() !== '' && (
              <div className="mb-8">
                <Image 
                  // src={`/buyer/${buyer.toLowerCase().replace(/\s+/g, '-')}.png`}
                  // alt={`${buyer} Logo`}
                  src="/rba.avif"
                  alt="RBA Logo"
                  width={200}
                  height={100}
                  className="mx-auto h-20 w-auto mb-4"
                />
              </div>
            )} */}
            
            {/* Show buyer logo */}
            <div className="mb-8">
              <Image 
                // src={`/buyer/${buyer.toLowerCase().replace(/\s+/g, '-')}.png`}
                // alt={`${buyer} Logo`}
                src="/rba.avif"
                alt="RBA Logo"
                width={200}
                height={100}
                className="mx-auto h-32 w-auto mb-4"
              />
            </div>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-[800px] mx-auto">
            Congratulations! You have been matched with one of our partners, Renewal By Andersen. The Customer Specialist will be contacting you soon!
            </p>
            
            {/* About Renewal by Andersen Section */}
            <div className="mt-12 mb-12 max-w-6xl mx-auto">
              <h4 className="text-3xl font-bold text-gray-800 mb-10 text-center">
                About Renewal by Andersen
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6">
                {/* Card 1: Trusted Company */}
                <div className="bg-linear-to-br from-sky-50 to-white rounded-xl shadow-lg border border-sky-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mb-5 shadow-md">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">
                      Trusted Excellence
                    </h5>
                    <ul className="text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Division of Andersen Corporation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Decades of craftsmanship</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Nationwide reliability</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 2: Specialization */}
                <div className="bg-linear-to-br from-sky-50 to-white rounded-xl shadow-lg border border-sky-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mb-5 shadow-md">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">
                      Custom Solutions
                    </h5>
                    <ul className="text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Custom-made windows & doors</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Energy efficient design</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Enhanced curb appeal</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card 3: Full-Service Approach */}
                <div className="bg-linear-to-br from-sky-50 to-white rounded-xl shadow-lg border border-sky-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mb-5 shadow-md">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">
                      Premium Service
                    </h5>
                    <ul className="text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Full-service approach</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Premium materials</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-sky-600 mr-2">•</span>
                        <span>Industry-leading warranties</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email confirmation message */}
            {/* <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800 font-medium mb-2">
                A confirmation message has been sent to your email address.
              </p>
              <p className="text-green-700 text-sm">
              The message contains information about Platinum Window Experts and your free estimate. Please check your spam or promotions folder if you don&apos;t see it in your inbox.
                </p>
            </div> */}
            {/* <div className="thankyou-contact-container bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                For immediate assistance
              </h4>
              <p className="text-gray-600">
                Call us at{' '}
                <a 
                  href="tel:+18556591507" 
                  className="text-sky-600 font-semibold hover:text-secondary transition-colors"
                >
                  1-855-659-1507
                </a>
                .
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Thank You Divider */}
      <div className="thankyou-divider h-1 bg-linear-to-r from-sky-500 to-sky-600"></div>

      {/* Ad Section */}
      <section id="ad" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="ad-content text-center max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 mb-8 font-medium">
            In addition to window services, here are {ads.length} great offers.
            </p>

            <div className="ad-images grid grid-cols-1 md:grid-cols-1 gap-8">
              {ads.map((ad, index) => {
                // Replace template variables in the ad link
                const processedLink = ad.link
                  .replace('${utmParams.utm_source}', utmParams.utm_source || '')
                  .replace('${utmParams.utm_id}', utmParams.utm_id || '')
                  .replace('${utmParams.utm_s1}', utmParams.utm_s1 || '');
                
                return (
                  <a 
                    key={index}
                    href={processedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block transition-transform hover:scale-105"
                  >
                    <Image 
                      src={ad.image} 
                      alt="Ads Image" 
                      width={400} 
                      height={300}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  )
}
