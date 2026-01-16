import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const zipCode = searchParams.get('zipCode')

    if (!zipCode || zipCode.length !== 5) {
      return NextResponse.json(
        { city: '', error: 'Invalid zip code' },
        { status: 400 }
      )
    }

    // Use Zippopotam.us free API for zip code lookup
    const apiUrl = `https://api.zippopotam.us/us/${zipCode}`
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PlatinumWindowExpert/1.0)'
        }
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      
      const data = await response.json()
      
      // Extract city from the response
      // Zippopotam.us returns places array, get the first one
      if (data.places && data.places.length > 0) {
        const city = data.places[0]['place name'] || ''
        const state = data.places[0]['state abbreviation'] || ''
        
        return NextResponse.json(
          { city, state, zipCode },
          {
            headers: {
              'Cache-Control': 'public, max-age=3600, s-maxage=3600',
              'Content-Type': 'application/json',
            }
          }
        )
      }
      
      return NextResponse.json(
        { city: '', state: '', zipCode },
        { status: 404 }
      )
    } catch (error) {
      console.error('Error fetching city from zip code:', error)
      
      // Fallback: try using Google Geocoding API if available
      if (process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY) {
        try {
          const geocodeController = new AbortController()
          const geocodeTimeoutId = setTimeout(() => geocodeController.abort(), 5000)
          
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`
          
          const geocodeResponse = await fetch(geocodeUrl, {
            signal: geocodeController.signal
          })
          
          clearTimeout(geocodeTimeoutId)
          
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            
            if (geocodeData.results && geocodeData.results.length > 0) {
              const result = geocodeData.results[0]
              let city = ''
              let state = ''
              
              // Extract city and state from address components
              for (const component of result.address_components) {
                if (component.types.includes('locality')) {
                  city = component.long_name
                }
                if (component.types.includes('administrative_area_level_1')) {
                  state = component.short_name
                }
              }
              
              if (city) {
                return NextResponse.json(
                  { city, state, zipCode },
                  {
                    headers: {
                      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
                      'Content-Type': 'application/json',
                    }
                  }
                )
              }
            }
          }
        } catch (geocodeError) {
          console.error('Google Geocoding API error:', geocodeError)
        }
      }
      
      return NextResponse.json(
        { city: '', state: '', zipCode },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Get city from zip API error:', error)
    return NextResponse.json(
      { city: '', state: '', zipCode: '', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
