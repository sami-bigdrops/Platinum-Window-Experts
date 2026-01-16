'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface AddressInputProps {
  id: string
  label?: string
  value: string
  onChange: (value: string) => void
  onAddressSelect?: (address: string, city: string, state: string, zipCode: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  className?: string
  error?: string
}

interface GooglePlace {
  formatted_address?: string
  address_components?: Array<{
    types: string[]
    long_name: string
    short_name: string
  }>
}

interface GoogleAutocomplete {
  getPlace: () => GooglePlace
  addListener: (event: string, callback: () => void) => void
}

interface GoogleMapsPlaces {
  Autocomplete: {
    new (
      inputField: HTMLInputElement,
      options?: {
        types?: string[]
        componentRestrictions?: { country: string }
      }
    ): GoogleAutocomplete
  }
}

interface GoogleMaps {
  maps: {
    places: GoogleMapsPlaces
    event?: {
      clearInstanceListeners?: (instance: unknown) => void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleMaps
    __googleMapsScriptLoaded?: boolean
  }
}

// Global promise to track script loading - prevents multiple script loads
let googleMapsScriptPromise: Promise<void> | null = null

const loadGoogleMapsScript = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (typeof window !== 'undefined' && window.google && window.__googleMapsScriptLoaded) {
    return Promise.resolve()
  }

  // If script is already loading, return existing promise
  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise
  }

  // Check if script tag already exists in DOM
  const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
  if (existingScript) {
    // Script exists, create promise that resolves when loaded
    googleMapsScriptPromise = new Promise<void>((resolve) => {
      if (window.google) {
        window.__googleMapsScriptLoaded = true
        resolve()
      } else {
        existingScript.addEventListener('load', () => {
          window.__googleMapsScriptLoaded = true
          resolve()
        })
      }
    })
    return googleMapsScriptPromise
  }

  // Create new script
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.error('Google Places API key is not configured. Please set NEXT_PUBLIC_GOOGLE_PLACES_API_KEY in your environment variables.')
    return Promise.reject(new Error('Google Places API key not configured'))
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.id = 'google-maps-script'
    
    script.onload = () => {
      window.__googleMapsScriptLoaded = true
      resolve()
    }
    
    script.onerror = () => {
      console.error('Failed to load Google Places API script')
      googleMapsScriptPromise = null
      reject(new Error('Failed to load Google Places API'))
    }
    
    document.head.appendChild(script)
  })

  return googleMapsScriptPromise
}

const AddressInput: React.FC<AddressInputProps> = ({
  id,
  label,
  value,
  onChange,
  onAddressSelect,
  onBlur,
  placeholder = 'Enter your address',
  required = false,
  className = '',
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<GoogleAutocomplete | null>(null)
  const listenerRef = useRef<(() => void) | null>(null)
  const onChangeRef = useRef(onChange)
  const onAddressSelectRef = useRef(onAddressSelect)
  const [isScriptLoaded, setIsScriptLoaded] = useState(() => {
    if (typeof window !== 'undefined' && window.google && window.__googleMapsScriptLoaded) {
      return true
    }
    return false
  })

  // Update refs when callbacks change
  useEffect(() => {
    onChangeRef.current = onChange
    onAddressSelectRef.current = onAddressSelect
  }, [onChange, onAddressSelect])

  // Load Google Maps script
  useEffect(() => {
    if (isScriptLoaded) return

    loadGoogleMapsScript()
      .then(() => {
        setIsScriptLoaded(true)
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error)
      })
  }, [isScriptLoaded])

  // Track if autocomplete has been initialized to prevent re-initialization
  const isInitializedRef = useRef(false)

  // Initialize autocomplete when script is loaded
  useEffect(() => {
    if (!isScriptLoaded || !inputRef.current || !window.google) return
    
    // Don't re-initialize if autocomplete already exists and is initialized
    if (isInitializedRef.current && autocompleteRef.current) {
      return
    }

    // Clean up existing autocomplete if it exists
    if (autocompleteRef.current && listenerRef.current) {
      try {
        window.google.maps.event?.clearInstanceListeners?.(autocompleteRef.current)
      } catch {
        // Ignore cleanup errors
      }
    }

    // Initialize new autocomplete
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'us' }
        }
      )

      // Create place changed handler
      const handlePlaceChanged = () => {
        if (!autocompleteRef.current) return

        const place = autocompleteRef.current.getPlace()
        
        if (!place) return

        // Initialize variables
        let streetNumber = ''
        let route = ''
        let city = ''
        let state = ''
        let zipCode = ''
        let finalAddress = ''

        // ALWAYS parse from formatted_address FIRST as primary source for reliable parsing
        // This ensures we get the correct city name (not sublocality) and proper formatting
        if (place.formatted_address) {
          const formatted = place.formatted_address
          const parts = formatted.split(',').map(p => p.trim())
          
          // Extract address (first part before first comma)
          // Example: "123 William Street, New York, NY, USA" -> "123 William Street"
          if (parts.length > 0) {
            finalAddress = parts[0]
          }

          // Extract city (second part) - ALWAYS use formatted_address city
          // Example: "123 William Street, New York, NY, USA" -> "New York"
          if (parts.length > 1) {
            city = parts[1]
          }

          // Extract state (third part - extract 2-letter code)
          // Example: "123 William Street, New York, NY, USA" -> "NY"
          // Or: "123 William Street, New York, NY 10001, USA" -> "NY"
          if (parts.length > 2) {
            const statePart = parts[2]
            // Match 2 uppercase letters at the start (state code like "NY", "TX")
            const stateMatch = statePart.match(/^([A-Z]{2})\b/)
            if (stateMatch) {
              state = stateMatch[1]
            } else {
              // Fallback: try to get first 2 uppercase letters anywhere
              const upperMatch = statePart.match(/([A-Z]{2})/)
              if (upperMatch) {
                state = upperMatch[1]
              } else if (statePart.length === 2 && statePart === statePart.toUpperCase()) {
                // If the whole part is 2 uppercase letters, use it
                state = statePart
              }
            }
          }
        }

        // Extract zip code and other components from address_components
        if (place.address_components && place.address_components.length > 0) {
          for (const component of place.address_components) {
            const types = component.types

            // Get street number
            if (types.includes('street_number')) {
              streetNumber = component.long_name.trim()
            }

            // Get route (street name)
            if (types.includes('route')) {
              route = component.long_name.trim()
            }

            // Get zip code
            if (types.includes('postal_code')) {
              zipCode = component.long_name.trim()
            }
          }

          // Build street address: combine street number and route (only if we don't have finalAddress yet)
          if (!finalAddress) {
            const addressParts: string[] = []
            if (streetNumber) {
              addressParts.push(streetNumber)
            }
            if (route) {
              addressParts.push(route)
            }
            finalAddress = addressParts.join(' ').trim()
          }
        }

        // Final fallback: If still no address, use formatted_address
        if (!finalAddress && place.formatted_address) {
          finalAddress = place.formatted_address
        }
        
        // Update the input value using ref to get latest callback
        if (onChangeRef.current) {
          onChangeRef.current(finalAddress)
        }
        
        // Call callback with parsed values using ref to get latest callback
        if (onAddressSelectRef.current) {
          onAddressSelectRef.current(finalAddress, city, state, zipCode)
        }
      }

      // Store listener reference for cleanup
      listenerRef.current = handlePlaceChanged

      // Add listener
      autocompleteRef.current.addListener('place_changed', handlePlaceChanged)
      
      // Mark as initialized to prevent re-initialization
      isInitializedRef.current = true
    } catch (error) {
      console.error('Error initializing Google Places Autocomplete:', error)
      isInitializedRef.current = false
    }

    // Cleanup function
    return () => {
      if (autocompleteRef.current && listenerRef.current && window.google) {
        try {
          window.google.maps.event?.clearInstanceListeners?.(autocompleteRef.current)
        } catch {
          // Ignore cleanup errors
        }
      }
      autocompleteRef.current = null
      listenerRef.current = null
      isInitializedRef.current = false
    }
  }, [isScriptLoaded])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-base font-semibold text-gray-700 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-4 text-base border-2 rounded-xl
          focus:outline-none focus:ring-2 transition-all duration-200 font-medium
          ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#3498DB] focus:border-transparent'
          }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default AddressInput
