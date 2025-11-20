'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Columns2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import RadioButtonGroup, { type RadioOption } from '@/components/ui/RadioButtonGroup'
import ProgressBar from '@/components/ui/ProgressBar'
import TextInput from '@/components/ui/TextInput'
import PhoneInput from '@/components/ui/PhoneInput'
import TrustedForm from '@/components/TrustedForm'
import PartnerModal from '@/components/ui/PartnerModal'

const FormPage = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCurrentStep = localStorage.getItem('windows_current_step')
        if (savedCurrentStep) {
          const step = parseInt(savedCurrentStep, 10)
          if (step >= 1) return step
        }
      } catch (error) {
        console.error('Error loading current step from localStorage:', error)
      }
    }
    return 1
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [trustedFormCertUrl, setTrustedFormCertUrl] = useState('')
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false)
  
  // Initialize UTM parameters from URL or cookies
  const [subid1, setSubid1] = useState(() => {
    if (typeof window === 'undefined') return ''
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_source') || ''
  })
  const [subid2, setSubid2] = useState(() => {
    if (typeof window === 'undefined') return ''
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_id') || ''
  })
  const [subid3, setSubid3] = useState(() => {
    if (typeof window === 'undefined') return ''
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_s1') || ''
  })
  
  const [formData, setFormData] = useState(() => {
    const defaultData = { homeowner: '', windowCount: '', windowAge: '', planningProcess: '', firstName: '', lastName: '', email: '', phoneNumber: '' }
    if (typeof window !== 'undefined') {
      try {
        const savedFormData = localStorage.getItem('windows_form_data')
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData)
          return { 
            ...defaultData, 
            ...parsedData,
            firstName: parsedData.firstName || '',
            lastName: parsedData.lastName || '',
            email: parsedData.email || ''
          }
        }
      } catch (error) {
        console.error('Error loading form data from localStorage:', error)
      }
    }
    return defaultData
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('windows_form_data', JSON.stringify(formData))
      } catch (error) {
        console.error('Error saving form data to localStorage:', error)
      }
    }
  }, [formData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('windows_current_step', currentStep.toString())
      } catch (error) {
        console.error('Error saving current step to localStorage:', error)
      }
    }
  }, [currentStep])

  // Handle TrustedForm certificate data
  const handleTrustedFormReady = (certUrl: string) => {
    setTrustedFormCertUrl(certUrl)
  }

  // UTM Parameter Detection with Cookie Fallback
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Helper function to get cookie value
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
      return ''
    }

    // Helper function to set cookie
    const setCookie = (name: string, value: string, days: number = 30) => {
      const expires = new Date()
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
    }

    const urlParams = new URLSearchParams(window.location.search)
    const utmSource = urlParams.get('utm_source') || ''
    const utmId = urlParams.get('utm_id') || ''
    const utmS1 = urlParams.get('utm_s1') || ''

    // If URL parameters exist, use them and save to cookies
    if (utmSource || utmId || utmS1) {
      if (utmSource) {
        setCookie('subid1', utmSource)
        setTimeout(() => setSubid1(utmSource), 0)
      }
      if (utmId) {
        setCookie('subid2', utmId)
        setTimeout(() => setSubid2(utmId), 0)
      }
      if (utmS1) {
        setCookie('subid3', utmS1)
        setTimeout(() => setSubid3(utmS1), 0)
      }
      
      // Clean the URL by removing UTM parameters
      const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)
    } else {
      // If no URL parameters, try to read from cookies
      const cookieSubid1 = getCookie('subid1') || ''
      const cookieSubid2 = getCookie('subid2') || ''
      const cookieSubid3 = getCookie('subid3') || ''
      
      if (cookieSubid1) setTimeout(() => setSubid1(cookieSubid1), 0)
      if (cookieSubid2) setTimeout(() => setSubid2(cookieSubid2), 0)
      if (cookieSubid3) setTimeout(() => setSubid3(cookieSubid3), 0)
    }
  }, [])

  const handleInputChange = (field: string, value: string, autoAdvance = false) => {
    const updatedData = { ...formData, [field]: value }
    setFormData(updatedData as { homeowner: string; windowCount: string; windowAge: string; planningProcess: string; firstName: string; lastName: string; email: string; phoneNumber: string })

          if (autoAdvance) {
      setTimeout(() => {
        setCurrentStep((prevStep) => {
          const nextStep = prevStep + 1
          // Only auto-advance if not on the last step
          if (nextStep <= 6) {
            return nextStep
          }
          // Don't auto-submit, let user click the button
          return prevStep
        })
      }, 150)
    }
  }

  const handleNext = async () => {
    if (isStepValid()) {
      if (currentStep === 6) {
        setIsSubmitting(true)
        
        try {
          // Get zipCode from localStorage (set from hero page)
          const zipCode = typeof window !== 'undefined' ? localStorage.getItem('zipCode') || '' : ''
          
          // Submit form data to API
          const response = await fetch('/api/submit-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phoneNumber: formData.phoneNumber,
              homeowner: formData.homeowner,
              windowCount: formData.windowCount,
              windowAge: formData.windowAge,
              planningProcess: formData.planningProcess,
              zipCode: zipCode,
              subid1: subid1,
              subid2: subid2,
              subid3: subid3,
              trustedformCertUrl: trustedFormCertUrl,
            }),
          })

          let result
          try {
            result = await response.json()
            // Ensure result has success field
            if (typeof result.success === 'undefined') {
              result.success = response.ok
            }
          } catch (parseError) {
            console.error('Error parsing API response:', parseError)
            result = { success: false, error: 'Invalid response from server' }
          }

          // Clear localStorage regardless of API response
          if (typeof window !== 'undefined') {
            localStorage.removeItem('windows_form_data')
            localStorage.removeItem('windows_current_step')
          }

          // Always redirect to thank you page, regardless of API response
          const redirectUrl = result.success && result.redirectUrl 
            ? result.redirectUrl 
            : '/thankyou'
          
          // Use replace to prevent back button issues
          router.replace(redirectUrl)
          
          if (!result.success) {
            console.error('Form submission error:', result.error || 'Unknown error')
          }
        } catch (error) {
          console.error('Error submitting form:', error)
          // Clear localStorage and redirect on error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('windows_form_data')
            localStorage.removeItem('windows_current_step')
          }
          router.replace('/thankyou')
        }
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.homeowner !== ''
      case 2:
        return formData.windowCount !== ''
      case 3:
        return formData.windowAge !== ''
      case 4:
        return formData.planningProcess !== ''
      case 5:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return (formData.firstName?.trim() || '') !== '' && (formData.lastName?.trim() || '') !== '' && formData.email && emailRegex.test(formData.email)
      case 6:
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/
        return formData.phoneNumber && phoneRegex.test(formData.phoneNumber)
      default:
        return false
    }
  }

  const homeownerOptions: RadioOption[] = [
    { id: 'YES', label: 'Yes' },
    { id: 'NO', label: 'No' },
  ]

  const windowCountOptions: RadioOption[] = [
    { id: '1_2', label: '1 - 2 Windows' },
    { id: '3_5', label: '3 - 5 Windows' },
    { id: '6_PLUS', label: '6+ Windows' },
    { id: 'NOT_SURE', label: 'I am not sure' },
  ]

  const windowAgeOptions: RadioOption[] = [
    { id: 'LESS_THAN_10', label: 'Less than 10 years' },
    { id: '10_15', label: '10 - 15 years' },
    { id: 'OVER_15', label: 'Over 15+ years' },
    { id: 'NOT_SURE', label: 'I am not sure' },
  ]

  const planningProcessOptions: RadioOption[] = [
    { id: 'READY_TO_INSTALL', label: 'Ready to Install' },
    { id: 'JUST_GETTING_PRICE', label: 'Just getting a price' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-50 px-4 pt-12 md:pt-24 pb-8 md:pb-12">
      <div className="w-full max-w-2xl mx-auto">
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={6}
          icon={<Columns2 size={20} className="text-sky-600" />}
        />

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10">
          <TrustedForm onCertUrlReady={handleTrustedFormReady} />
          
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Are you a homeowner?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={homeownerOptions}
                value={formData.homeowner}
                onChange={(value) => handleInputChange('homeowner', value, true)}
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                How many windows do you need to repair/replace?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={windowCountOptions}
                value={formData.windowCount}
                onChange={(value) => handleInputChange('windowCount', value, true)}
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                How old are your windows?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={windowAgeOptions}
                value={formData.windowAge}
                onChange={(value) => handleInputChange('windowAge', value, true)}
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 4 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Where are you in the planning process?
              </h2>
              <RadioButtonGroup
                label="Select an Option"
                options={planningProcessOptions}
                value={formData.planningProcess}
                onChange={(value) => handleInputChange('planningProcess', value, true)}
                required
                className="mb-8"
              />
            </>
          )}

          {currentStep === 5 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                Who should we prepare this FREE quote for?
              </h2>
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <TextInput
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    placeholder="John"
                    required
                  />
                  <TextInput
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    placeholder="Doe"
                    required
                  />
                </div>
                <TextInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </>
          )}

          {currentStep === 6 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e1e1e] mb-8 md:mb-10">
                What is your phone number?
              </h2>
              <PhoneInput
                id="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(value) => handleInputChange('phoneNumber', value)}
                placeholder="(123) 456-7890"
                required
                className="mb-8"
              />
            </>
          )}

          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-bold text-base md:text-lg
                  border-2 border-gray-300 text-gray-700 hover:border-sky-600 hover:text-sky-600
                  transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className={`
                ${currentStep > 1 ? 'flex-1' : 'w-full'} py-4 rounded-xl font-bold text-base md:text-lg
                transition-all duration-300 flex items-center justify-center gap-2
                ${
                  !isStepValid() || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 6 ? (
                'Submit Details'
              ) : (
                'Continue'
              )}
            </button>
          </div>

          {currentStep === 6 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                By submitting this form, I agree to the Platinum Window Experts{' '}
                <a href="/terms-of-use" className="text-sky-600 hover:text-sky-700 underline" target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-sky-600 hover:text-sky-700 underline" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                . I authorize Platinum Window Experts and its{' '}
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="text-sky-600 hover:text-sky-700 underline cursor-pointer"
                >
                  partners
                </button>{' '}
                to send me marketing text messages or phone calls at the number provided, including those made with an autodialer. Standard message and data rates may apply. Message frequency varies. Opt-out anytime by replying STOP or using the unsubscribe link.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Partner Modal */}
      <PartnerModal 
        isOpen={isPartnerModalOpen} 
        onClose={() => setIsPartnerModalOpen(false)} 
      />
    </div>
  )
}

export default function FormPageWrapper() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-sky-600 text-xl font-semibold">Loading...</div>
      </div>
    }>
      <FormPage />
    </React.Suspense>
  )
}
