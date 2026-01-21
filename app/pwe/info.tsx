'use client'

import {  INFO_CONTENT, HERO_CONTENT } from '@/lib/constant'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Info() {
  const router = useRouter()
  const [zipCode, setZipCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedZipCode = localStorage.getItem('zipCode');
      return savedZipCode || '';
    }
    return '';
  });

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 5) {
      setZipCode(numericValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem('zipCode', numericValue);
      }
    }
  };

  const isValidZipCode = zipCode.length === 5;

  const handleSubmit = () => {
    if (isValidZipCode) {
      // Set access token to allow form access
      if (typeof window !== 'undefined') {
        const accessToken = crypto.randomUUID();
        sessionStorage.setItem('form_access_token', accessToken);
      }
      router.push('/form');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidZipCode) {
      handleSubmit();
    }
  };
  return (
    <div
      className='info w-full h-full p-4 md:p-9 lg:py-13 lg:px-13 xl:px-55 xl:py-15'
      style={{ background: '#F3F4F6' }}
    >
      <div className='container mx-auto'>
        <div className='content w-full flex flex-col items-center justify-center md:flex-row gap-8 md:gap-10 lg:gap-13 xl:gap-15'>
          <div className='title-container md:w-[50%] text-center flex flex-col items-center justify-center md:items-start gap-4 md:gap-4'>
            <div className='title'>
              <h2 className='title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem]  md:text-left md:max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] font-bold font-montserrat text-center text-dark' style={{ lineHeight: 1.3 }}>
                {INFO_CONTENT.heading}
                <span className='title-highlight heading-gradient inline-block'>
                  {INFO_CONTENT.headingHighlight}
                </span>
              </h2>
            </div>
            <div className='description'>
              <p className='description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:text-left md:max-w-[500px] lg:max-w-[650px] mx-auto font-roboto' style={{ lineHeight: 1.5 }}>
                {INFO_CONTENT.description}
              </p>
            </div>

            <div className="input-container-group flex flex-col md:flex-row items-center justify-start gap-4 w-full md:mt-2 xl:mt-4">
              <div className="input-container w-full max-w-[300px] relative bg-white rounded-sm px-3 py-2">
                <Image
                  src="/location.svg"
                  alt="Location"
                  width={18}
                  height={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={HERO_CONTENT.inputPlaceholder}
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  onKeyPress={handleKeyPress}
                  maxLength={5}
                  className="w-full pl-7 pr-4 py-2 rounded-md xl:text-[1.1rem] border-0 outline-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-0"
                />
              </div>
              <div className="cta-button w-full max-w-[160px] xl:max-w-[170px] flex items-center justify-center">
                <button 
                  onClick={handleSubmit}
                  disabled={!isValidZipCode}
                  className="bg-blue w-full text-white px-4 py-3 xl:py-4 rounded-sm font-medium font-roboto flex items-center justify-center gap-4 cursor-pointer hover:bg-[#275086] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {HERO_CONTENT.ctaButton}
                  <Image
                    src="/arrow.svg"
                    alt="Arrow"
                    width={12}
                    height={12}
                    className="w-auto h-[12px]"
                  />
                </button>
              </div>
            </div>


          </div>
          <div className="info-container w-full max-w-6xl mx-auto md:w-[50%]">
            <div className="relative w-full h-[280px] md:h-[200px] lg:h-[250px] xl:h-[300px] xl:w-[550px] overflow-hidden">
              <Image
                src={INFO_CONTENT.backgroundImage}
                alt="Beautiful house with windows"
                fill
                className="object-cover"
              />
              
              <div
                className="absolute top-0 right-0 w-[40%] md:hidden  h-full flex flex-col justify-center items-start p-6 pl-4 pr-4"
                style={{
                  background: "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(39, 80, 134, 0.90)"
                }}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  {INFO_CONTENT.stats.map((stat) => (
                    <div key={stat.id} className="text-white flex flex-col items-center justify-center">
                      <div className="text-xl  text-white text-center font-semibold font-montserrat ">
                        {stat.number}
                      </div>
                      <div className="text-[0.9rem]  font-roboto text-white text-center">
                        {stat.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
