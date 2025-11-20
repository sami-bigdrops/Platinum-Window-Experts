'use client'

import { HERO_CONTENT } from '@/lib/constant';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('/api/get-location');
        if (response.ok) {
          const data = await response.json();
          if (data.zipCode) {
            setZipCode(data.zipCode);
            setCity(data.city || '');
            if (typeof window !== 'undefined') {
              localStorage.setItem('zipCode', data.zipCode);
              if (data.city) {
                localStorage.setItem('city', data.city);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

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
      className="hero-section w-full h-full p-4 py-8 md:p-8 md:py-13 lg:p-10 lg:py-15 xl:p-16 xl:px-25 "
      style={{
        background:
          "linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), url('/hero-bg.webp') lightgray 50% / cover no-repeat",
      }}
    >
      <div className="container mx-auto">
        <div className="hero-content w-full">
          <div className="hero-container relative z-10 flex flex-col items-center justify-center md:items-start md:justify-start gap-5 text-center">
            <div className="title">
              <h1
                className="text-white text-center font-montserrat text-3xl md:text-4xl lg:text-5xl md:max-w-[400px] lg:max-w-[650px] font-bold md:text-left"
                style={{ lineHeight: 1.3 }}
              >
                {city 
                  ? HERO_CONTENT.mainHeading.replace('New York', city)
                  : HERO_CONTENT.mainHeading
                }
              </h1>
            </div>
            <div className="sub-title">
              <p
                className="text-white text-center font-roboto text-sm md:text-[0.9rem] lg:text-[0.95rem] xl:text-[1.2rem] font-normal"
                style={{ lineHeight: 1.4 }}
              >
                {HERO_CONTENT.subHeading}
              </p>
            </div>
            <div className="input-container-group flex flex-col md:flex-row items-center justify-center xl:mt-2 gap-4">
              <div className="input-container w-full max-w-[300px] relative bg-white rounded-sm px-3 py-2 ">
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
                  disabled={isLoadingLocation}
                  maxLength={5}
                  className="w-full pl-7 pr-4 py-2 rounded-md xl:text-[1.1rem] border-0 outline-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="cta-button w-full max-w-[160px] xl:max-w-[170px] flex items-center justify-center">
                <button 
                  onClick={handleSubmit}
                  disabled={!isValidZipCode || isLoadingLocation}
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

            <div className="trust-container w-full flex flex-col items-center justify-center md:items-start md:justify-start gap-3 xl:gap-4 mt-7">
              <div className="trust-title">
                <h2 className="text-white text-center font-roboto text-base lg:text-[1.1rem] font-medium">{HERO_CONTENT.trustText}</h2>
              </div>
               <div className="trust-logos flex items-center justify-center gap-6 md:gap-8">
                 
                 <div className="trust-logo">
                   <svg xmlns="http://www.w3.org/2000/svg" width="55" height="33" viewBox="0 0 55 33" fill="none" className='w-14 h-9 md:w-16 lg:w-20 xl:w-21'>
                     <path d="M21.0318 24.8166C19.7346 16.8156 18.4724 8.81462 17.2103 0.848859C17.1051 0.249664 16.8597 -0.0323095 16.2286 0.00293723C14.7211 0.038184 13.1785 0.038184 11.6709 0.00293723C10.8996 -0.0323095 10.6893 0.249664 10.5841 0.989846C10.0582 4.69075 9.39207 8.39166 8.83112 12.0926C8.69088 13.009 8.37535 13.4672 7.35862 13.7492C3.39692 14.8066 0.872649 17.3443 0.101344 21.4682C-0.494665 24.7461 1.60889 28.1651 4.55388 28.729C7.8144 29.3635 10.4088 27.3896 11.11 23.6535C11.3904 22.2789 11.5657 20.9042 11.7761 19.5296C12.0566 17.8378 12.302 17.732 13.6693 18.7542C14.3354 19.2829 14.8964 19.9173 15.3171 20.6575C16.1235 22.0321 16.5091 23.5478 16.6493 25.0986C16.7195 25.8388 16.9999 26.156 17.7362 26.0855C18.1218 26.0503 18.5075 26.0855 18.8581 26.0855C19.2087 26.0855 19.5242 26.0503 19.8748 26.0855C20.9967 26.2265 21.2071 25.8388 21.0318 24.8166ZM6.97297 23.1953C6.83274 23.865 6.58732 24.6756 5.64072 24.6052C4.69412 24.5347 4.34352 23.7592 4.2734 22.9133C4.02799 20.7985 5.43036 18.8599 7.88451 17.9788C7.60404 19.8468 7.32357 21.5387 6.97297 23.1953ZM15.0366 14.6656C12.6876 13.6787 12.6526 13.6434 12.9331 11.0352C13.1785 8.81462 13.494 6.62932 13.7745 4.40878C13.8446 4.40878 13.9498 4.40878 14.0199 4.40878C14.4757 7.79246 14.8964 11.2114 15.3522 14.5951C15.1769 14.6303 15.0717 14.6656 15.0366 14.6656Z" fill="white"/>
                     <path d="M47.9222 7.86293C47.9222 7.54571 47.8521 7.26374 47.4665 7.22849C46.6951 7.22849 45.9589 7.158 45.1876 7.33423C44.4163 7.51047 43.9605 8.03917 43.68 8.84984C43.1542 7.93343 42.5932 7.33423 41.6466 7.08751C38.8068 6.31208 36.3877 8.07441 36.2475 11.2819C36.1072 14.5598 36.2124 17.873 36.2124 21.1862C36.2124 21.6092 36.3176 22.0321 36.3877 22.4198C36.7383 24.0412 37.5797 25.2043 39.2976 25.5215C41.0155 25.8388 42.3828 25.3453 43.4346 23.8297C43.4346 25.2396 43.68 26.6142 43.3645 27.9888C43.1892 28.6233 42.8036 29.0462 42.1725 29.1167C41.5765 29.1872 40.9104 29.011 40.8052 28.447C40.5948 27.2486 39.7534 27.4601 38.9821 27.4601C38.316 27.4601 37.6148 27.4954 36.9487 27.4601C36.3176 27.4249 36.1423 27.6716 36.1773 28.2708C36.3176 30.0331 37.159 31.302 38.7717 32.0069C40.0689 32.6061 41.4012 32.5356 42.7685 32.4651C45.6784 32.3242 47.3613 30.879 47.6067 27.9888C48.2027 21.2919 47.782 14.5951 47.9222 7.86293ZM43.4346 20.1993C43.3645 21.1157 42.9789 21.8911 41.892 21.8206C40.8052 21.7501 40.5598 20.9042 40.5598 20.0231C40.5247 18.7894 40.5598 17.5558 40.5598 16.3574C40.5598 15.0885 40.5247 13.8196 40.5598 12.5507C40.5948 11.5638 40.9805 10.7884 42.0673 10.7532C43.1191 10.7179 43.4346 11.5286 43.4697 12.3745C43.5749 14.9475 43.645 17.591 43.4346 20.1993Z" fill="white"/>
                     <path d="M26.9568 8.8146C27.3775 8.39164 27.7281 7.96868 28.1488 7.65146C30.6731 5.85388 33.8635 7.26375 34.179 10.3655C34.3192 11.8458 34.2842 13.3262 34.2842 14.8065C34.2842 18.1902 34.2491 21.5739 34.3192 24.9576C34.3192 25.8388 34.0738 26.1207 33.1973 26.1207C29.9719 26.1207 29.9719 26.156 29.9719 22.878C29.9719 19.6706 29.9719 16.4631 29.9719 13.2204C29.9719 12.7622 29.9719 12.2688 29.9018 11.8458C29.7615 11.1761 29.3408 10.7179 28.5695 10.7179C27.8333 10.7179 27.3424 11.1056 27.2022 11.7753C27.062 12.4803 26.9918 13.1852 26.9918 13.9254C26.9568 17.591 26.9568 21.2919 26.9918 24.9576C26.9918 25.8388 26.7114 26.0855 25.8349 26.1207C22.5744 26.1207 22.5744 26.156 22.5744 22.9485C22.5744 18.1197 22.6094 13.2909 22.5393 8.49738C22.5393 7.47523 22.8198 7.19325 23.8014 7.2285C25.1337 7.26375 26.466 7.15801 26.9568 8.8146Z" fill="white"/>
                     <path d="M54.4433 16.6394C54.4433 19.4239 54.4082 22.2084 54.4784 24.9928C54.4784 25.8388 54.1979 26.0502 53.3915 26.0855C50.131 26.156 50.131 26.156 50.131 22.9133C50.131 18.0492 50.1661 13.1852 50.0959 8.32115C50.0959 7.43998 50.3414 7.19325 51.2179 7.19325C54.4433 7.19325 54.4433 7.15801 54.4433 10.436C54.4433 12.5155 54.4433 14.5598 54.4433 16.6394Z" fill="white"/>
                     <path d="M52.3396 5.43095C51.0074 5.46619 49.9907 4.51453 49.9205 3.17516C49.8504 1.83578 50.9022 0.743132 52.2345 0.707886C53.6018 0.707886 54.6886 1.76529 54.6886 3.06942C54.6536 4.37354 53.6368 5.43095 52.3396 5.43095Z" fill="white"/>
                   </svg>
                 </div>
                 
                 <div className="trust-logo">
                   <svg xmlns="http://www.w3.org/2000/svg" width="119" height="28" viewBox="0 0 119 28" fill="none" className='w-22 h-12 md:w-26 lg:w-30 xl:w-32'>
                     <path d="M66.5126 14.3538C65.5917 13.433 64.4592 12.7517 63.2141 12.3695C61.969 11.9873 60.6491 11.9158 59.37 12.1614C58.0909 12.4069 56.8914 12.9619 55.8764 13.7778C54.8614 14.5938 54.0618 15.6459 53.5475 16.8422C53.1341 17.809 52.9244 18.8505 52.9316 19.9019C52.9254 20.9356 53.1258 21.9601 53.5209 22.9153C53.916 23.8706 54.4979 24.7373 55.2325 25.4648C55.959 26.1754 56.8138 26.7419 57.7514 27.1344C59.7499 27.9542 61.991 27.9542 63.9894 27.1344C64.9271 26.7419 65.7818 26.1754 66.5084 25.4648C67.2436 24.7376 67.8262 23.871 68.2221 22.9157C68.6179 21.9605 68.819 20.9358 68.8135 19.9019C68.8209 18.8505 68.6112 17.8089 68.1975 16.8422C67.7977 15.914 67.2261 15.0697 66.5126 14.3538ZM64.997 21.819C64.8076 22.3671 64.5087 22.871 64.1186 23.3002C63.7277 23.7141 63.2548 24.042 62.73 24.263C61.5368 24.7356 60.2083 24.7356 59.0151 24.263C58.4902 24.0423 58.0172 23.7143 57.6265 23.3002C57.2351 22.8716 56.9354 22.3676 56.7459 21.819C56.3226 20.5745 56.3226 19.2251 56.7459 17.9806C56.9355 17.4321 57.2352 16.928 57.6265 16.4994C58.0173 16.0853 58.4902 15.7574 59.0151 15.5366C60.208 15.0625 61.5371 15.0625 62.73 15.5366C63.2548 15.7575 63.7277 16.0854 64.1186 16.4994C64.5085 16.9287 64.8074 17.4326 64.997 17.9806C65.4201 19.2251 65.4201 20.5745 64.997 21.819Z" fill="white"/>
                     <path d="M102.178 15.251V12.424H90.3622V15.3758H97.9126L90.0891 24.5338V27.3904H102.603V24.4386H94.2972L102.178 15.251Z" fill="white"/>
                     <path d="M109.967 24.4386L117.848 15.251V12.424H106.032V15.3758H113.583L105.759 24.5338V27.3904H118.273V24.4386H109.967Z" fill="white"/>
                     <path d="M45.9549 12.5594C43.745 11.6453 41.0335 12.022 39.2787 13.4355V7.13617H35.9639V27.3883H39.2808V19.4258C39.2808 17.9108 39.7169 15.3695 42.6316 15.3695C45.3072 15.3695 46.2576 17.5553 46.2576 19.4258V27.3862H49.5703V18.3361C49.5682 15.6149 48.2516 13.5095 45.9549 12.5594Z" fill="white"/>
                     <path d="M82.9875 20.596C82.9841 21.0644 82.9193 21.5303 82.7948 21.9819C82.6688 22.4404 82.4577 22.871 82.1725 23.2515C81.876 23.6428 81.4946 23.9619 81.057 24.1847C80.5144 24.4209 79.9289 24.5428 79.3371 24.5428C78.7453 24.5428 78.1599 24.4209 77.6173 24.1847C77.1797 23.9618 76.7984 23.6427 76.5017 23.2515C76.2161 22.8713 76.0049 22.4406 75.8794 21.9819C75.7546 21.5303 75.6891 21.0644 75.6847 20.596V12.3986H72.3953V20.9261C72.3953 24.1 73.7966 26.216 76.6182 27.274C78.3876 27.9132 80.3257 27.9087 82.0921 27.2613C85.5551 25.9536 86.2811 23.0886 86.2811 20.9134V12.4346H82.9875V20.596Z" fill="white"/>
                     <path d="M15.1499 27.3883H24.0868V12.2632L6.1982 7.13615V0.760681H0.273438V27.3883H9.21033V19.0047H15.1499V27.3883Z" fill="white"/>
                   </svg>
                 </div>
                 
                 <div className="trust-logo">
                   <svg xmlns="http://www.w3.org/2000/svg" width="103" height="27" viewBox="0 0 103 27" fill="none" className='w-22 h-12 md:w-26 lg:w-30 xl:w-32'>
                     <path d="M20.7205 23.3205H26.5783V16.0905H28.31L32.5414 23.3205H39.3178L34.1678 14.9805C36.6072 13.7205 38.3088 11.1855 38.3088 8.23047C38.3088 4.01547 34.8604 0.610471 30.6591 0.610471H20.7205V3.56547C18.5672 1.55547 15.7362 0.295471 12.5739 0.295471C6.12887 0.295471 0.858398 5.48547 0.858398 11.9655C0.858398 18.4455 6.12887 23.6505 12.589 23.6505C15.7512 23.6505 18.5822 22.3905 20.7356 20.3805V23.3205H20.7205ZM16.7451 16.0905C15.6759 17.1555 14.2002 17.8155 12.5739 17.8155C9.35138 17.8155 6.71615 15.1905 6.71615 11.9805C6.71615 8.77047 9.35138 6.14547 12.5739 6.14547C14.2002 6.14547 15.6609 6.79047 16.7451 7.87047L20.7205 3.91047V20.0505L16.7451 16.0905ZM26.5783 10.9905V5.71047H29.7707C31.2314 5.71047 32.436 6.91047 32.436 8.36547C32.436 9.82047 31.2314 10.9905 29.7707 10.9905H26.5783Z" fill="white"/>
                     <path d="M82.641 21.8205L82.2043 22.4205C82.8669 23.0055 83.7554 23.3955 84.8998 23.3955C86.24 23.3955 87.3092 22.6755 87.3092 21.4005C87.3092 20.3955 86.8122 19.9605 85.2311 19.4205L84.6288 19.2105C83.7403 18.9105 83.2584 18.6255 83.2584 17.9655C83.2584 17.1555 84.0114 16.8405 84.7191 16.8405C85.3817 16.8405 86.1045 17.2005 86.6165 17.6505L87.0833 17.0205C86.4207 16.4805 85.6829 16.1655 84.7191 16.1655C83.4994 16.1655 82.5055 16.8105 82.5055 18.0105C82.5055 18.9255 83.0627 19.5105 84.4029 19.9755L85.0805 20.2155C86.0894 20.5755 86.5563 20.7705 86.5563 21.4005C86.5563 22.3155 85.7582 22.7205 84.8998 22.7205C84.0114 22.7205 83.2133 22.3455 82.641 21.8205Z" fill="white"/>
                     <path d="M81.7375 22.9304L81.5267 22.3154C81.1051 22.5704 80.6985 22.6904 80.2015 22.6904C79.5089 22.6904 79.1776 22.2704 79.1776 21.5204V16.9454H81.6773V16.2254H79.1776V13.7654H78.3945V21.5204C78.3945 22.6904 78.9818 23.3954 80.1564 23.3954C80.7437 23.3954 81.2556 23.2304 81.7375 22.9304Z" fill="white"/>
                     <path d="M74.7655 23.3204V19.1354C74.9312 17.5604 76.2563 16.7954 77.5965 16.9754V16.1804C76.4069 16.0004 75.3076 16.6004 74.7655 17.6354L74.7505 16.2254H73.9976V23.3354H74.7655V23.3204Z" fill="white"/>
                     <path d="M69.4648 16.1505C67.462 16.1505 65.8357 17.7855 65.8357 19.7805C65.8357 21.7755 67.462 23.4105 69.4648 23.4105C71.4676 23.4105 73.1089 21.7755 73.1089 19.7805C73.1089 17.7705 71.4826 16.1505 69.4648 16.1505ZM69.4648 22.6305C67.8836 22.6305 66.6037 21.3405 66.6037 19.7655C66.6037 18.1905 67.8836 16.9005 69.4648 16.9005C71.061 16.9005 72.341 18.1905 72.341 19.7655C72.341 21.3405 71.061 22.6305 69.4648 22.6305Z" fill="white"/>
                     <path d="M61.5292 16.1505C60.3395 16.1505 59.3005 16.7955 58.6982 17.8005V16.2255H57.9302V26.2155H58.6982V21.7455C59.3005 22.7505 60.3697 23.4105 61.5743 23.4105C63.5169 23.4105 65.1281 21.7755 65.1281 19.7805C65.1281 17.7705 63.5018 16.1505 61.5292 16.1505ZM61.5292 22.6305C59.9631 22.6305 58.6982 21.3405 58.6982 19.7655C58.6982 18.1905 59.9631 16.9005 61.5292 16.9005C63.0952 16.9005 64.3601 18.1905 64.3601 19.7655C64.3601 21.3405 63.0952 22.6305 61.5292 22.6305Z" fill="white"/>
                     <path d="M57.0568 19.4655C57.0568 17.4855 55.5961 16.1505 53.7891 16.1505C51.9369 16.1505 50.3708 17.6205 50.3708 19.7505C50.3708 21.8505 52.0122 23.4105 53.9246 23.4105C55.0691 23.4105 56.0479 22.9305 56.7406 22.0605L56.1834 21.5955C55.6564 22.3005 54.8733 22.6755 53.9246 22.6755C52.4489 22.6755 51.2593 21.5355 51.1539 19.9605H57.0568V19.4655ZM51.1689 19.2555C51.3798 17.8155 52.464 16.8555 53.7741 16.8555C55.0841 16.8555 56.1684 17.8155 56.2587 19.2555H51.1689Z" fill="white"/>
                     <path d="M47.4494 19.0155C49.1962 18.7455 50.2352 17.4855 50.2352 16.0155C50.2352 14.2605 49.0306 12.9705 46.832 12.9705H43.3535V23.3355H44.1667V19.0755H46.4857L49.4221 23.3355H50.4159L47.4494 19.0155ZM44.1667 18.2955V13.7355H46.817C48.4583 13.7355 49.407 14.6505 49.407 16.0155C49.407 17.2305 48.5788 18.2955 46.7868 18.2955H44.1667Z" fill="white"/>
                     <path d="M100.169 10.9904V6.80543C100.335 5.23043 101.66 4.46543 103 4.64543V3.85043C101.81 3.67043 100.711 4.27043 100.169 5.30543L100.154 3.89543H99.4011V11.0054H100.169V10.9904Z" fill="white"/>
                     <path d="M98.5126 7.13544C98.5126 5.15543 97.052 3.82043 95.2449 3.82043C93.3927 3.82043 91.8267 5.29043 91.8267 7.42043C91.8267 9.52043 93.468 11.0804 95.3805 11.0804C96.5249 11.0804 97.5037 10.6004 98.1964 9.73043L97.6392 9.26543C97.1122 9.97043 96.3291 10.3454 95.3805 10.3454C93.9047 10.3454 92.7151 9.20543 92.6097 7.63043H98.5126V7.13544ZM92.6248 6.92543C92.8356 5.48543 93.9198 4.52543 95.2299 4.52543C96.54 4.52543 97.6242 5.48543 97.7145 6.92543H92.6248Z" fill="white"/>
                     <path d="M81.105 7.39042C81.1351 5.51542 82.0838 4.52542 83.4089 4.52542C84.5233 4.52542 85.2611 5.23042 85.2461 6.50542V10.9904H86.0141V7.39042C86.0442 5.51542 86.9929 4.52542 88.318 4.52542C89.4323 4.52542 90.1702 5.23042 90.1551 6.50542V10.9904H90.9231V6.47542C90.9382 4.81042 90.0045 3.80542 88.3933 3.80542C87.2488 3.80542 86.2851 4.48042 85.8635 5.50042C85.5472 4.45042 84.6889 3.80542 83.4692 3.80542C82.4151 3.80542 81.4965 4.40542 81.0749 5.30542V3.88042H80.3069V10.9904H81.0749V7.39042H81.105Z" fill="white"/>
                     <path d="M78.4096 10.9904H79.1776V3.89545H78.4096V7.51045C78.3795 9.38545 77.3405 10.3754 75.8948 10.3754C74.7504 10.3754 73.9975 9.67045 73.9975 8.39545V3.89545H73.2295V8.41045C73.2295 10.0754 74.1782 11.0804 75.8196 11.0804C76.9941 11.0804 77.988 10.4504 78.4247 9.50545V10.9904H78.4096Z" fill="white"/>
                     <path d="M67.673 9.49045L67.2363 10.0904C67.8989 10.6754 68.7874 11.0654 69.9318 11.0654C71.272 11.0654 72.3412 10.3454 72.3412 9.07045C72.3412 8.06545 71.8442 7.63045 70.2631 7.09045L69.6607 6.88045C68.7723 6.58045 68.2904 6.29545 68.2904 5.63545C68.2904 4.82545 69.0433 4.51045 69.7511 4.51045C70.4137 4.51045 71.1365 4.87045 71.6485 5.32045L72.1153 4.69045C71.4527 4.15045 70.7148 3.83545 69.7511 3.83545C68.5314 3.83545 67.5375 4.48045 67.5375 5.68045C67.5375 6.59545 68.0947 7.18045 69.4349 7.64545L70.1125 7.88545C71.1214 8.24545 71.5882 8.44045 71.5882 9.07045C71.5882 9.98545 70.7901 10.3904 69.9318 10.3904C69.0433 10.3904 68.2452 10.0154 67.673 9.49045Z" fill="white"/>
                     <path d="M61.2579 7.39042C61.288 5.51542 62.3271 4.52542 63.7727 4.52542C64.9171 4.52542 65.67 5.23042 65.67 6.50542V10.9904H66.438V6.47542C66.438 4.81042 65.4893 3.80542 63.848 3.80542C62.6734 3.80542 61.6795 4.43542 61.2428 5.38042V3.88042H60.4749V10.9904H61.2428V7.39042H61.2579Z" fill="white"/>
                     <path d="M55.9726 3.82043C53.9698 3.82043 52.3435 5.45543 52.3435 7.45043C52.3435 9.44544 53.9698 11.0804 55.9726 11.0804C57.9754 11.0804 59.6168 9.44544 59.6168 7.45043C59.6168 5.45543 57.9754 3.82043 55.9726 3.82043ZM55.9726 10.3004C54.3915 10.3004 53.1115 9.01044 53.1115 7.43544C53.1115 5.86044 54.3915 4.57043 55.9726 4.57043C57.5688 4.57043 58.8488 5.86044 58.8488 7.43544C58.8488 9.01044 57.5688 10.3004 55.9726 10.3004Z" fill="white"/>
                     <path d="M51.1688 8.53044C50.3557 9.58044 49.0757 10.2404 47.6451 10.2404C45.2057 10.2404 43.2029 8.26044 43.2029 5.81544C43.2029 3.38544 45.2057 1.40544 47.6451 1.40544C49.0908 1.40544 50.3557 2.05044 51.1688 3.13044L51.7862 2.53044C50.8074 1.34544 49.3016 0.580444 47.6451 0.580444C44.7389 0.580444 42.3596 2.95044 42.3596 5.83044C42.3596 8.72544 44.7389 11.0954 47.6451 11.0954C49.3166 11.0954 50.7924 10.3304 51.7561 9.13044L51.1688 8.53044Z" fill="white"/>
                     <path d="M87.038 14.2755H86.6013V14.1705H87.5801V14.2755H87.1434V15.5505H87.038V14.2755Z" fill="white"/>
                     <path d="M89.1612 14.1705V15.5505H89.0558V14.3805L88.5438 15.2505H88.4685L87.9565 14.3805V15.5505H87.8511V14.1705H87.9565L88.5137 15.1305L89.0708 14.1705H89.1612Z" fill="white"/>
                   </svg>
                 </div>
               </div>
            </div>

            <div className="hero-right absolute top-5 lg:top-25 2xl:right-20 xl:top-20 right-0 z-0 hidden md:block">
              <div className="md:flex md:flex-col lg:flex-row lg:gap-4 md:items-center md:justify-center md:gap-4 lg:gap-6   hidden md:block">
                <div className="flex-box-1 flex flex-col w-full lg:max-w-[300px] xl:max-w-[350px] lg:absolute lg:right-55 xl:right-58 lg:top-10 xl:top-9 items-center justify-center gap-4 lg:gap-6 xl:gap-8">
                  <div
                    className="stat-box stat-box-1 flex flex-col items-start justify-start gap-1 xl:gap-2  pt-15  p-7   lg:pt-30 xl:pt-35"
                    style={{
                      borderRadius: "5px",
                      background:
                        "linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), rgba(39, 80, 134, 0.80)",
                    }}
                  >
                    <div className="stat-number font-montserrat text-white text-2xl lg:text-3xl xl:text-4xl font-semibold">
                      {HERO_CONTENT.statistics[0].number}
                    </div>
                    <div className="stat-label font-roboto text-white text-[1rem] lg:text-[1.1rem] xl:text-[1.08rem] font-medium">
                      {HERO_CONTENT.statistics[0].label}
                    </div>
                  </div>
                  <div className="stat-box stat-box-2 bg-white flex flex-col items-start justify-start gap-1 xl:gap-2 pt-15 p-5 lg:pt-28 xl:pt-32 lg:p-5 xl:p-5" style={{
                      borderRadius: "5px",
                     
                    }}>
                    <div className="stat-number font-montserrat text-dark text-2xl lg:text-3xl xl:text-4xl font-semibold">
                      {HERO_CONTENT.statistics[2].number}
                    </div>
                    <div className="stat-label font-roboto text-dark- text-[1rem] lg:text-[1.1rem] xl:text-[1.08rem] font-medium">
                      {HERO_CONTENT.statistics[2].label}
                    </div>
                    <div className="customer-avatars mt-1 xl:mt-2">
                      {HERO_CONTENT.statistics[2].icon && (
                        <img
                          src={HERO_CONTENT.statistics[2].icon}
                          alt="Happy Homeowners"
                          className="w-auto h-9"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-box-2 flex flex-col  items-center justify-center gap-4 lg:gap-6 xl:gap-8">
                  <div
                    className="stat-box stat-box-3 flex flex-col items-start justify-start gap-1 xl:gap-2 pt-18 p-7 lg:pt-33 xl:pt-38"
                    style={{
                      borderRadius: "5px",
                      background: "rgba(0, 0, 0, 0.70)",
                    }}
                  >
                    <div className="stat-number font-montserrat text-white text-2xl lg:text-3xl xl:text-4xl font-semibold">
                      {HERO_CONTENT.statistics[1].number}
                    </div>
                    <div className="stat-label font-roboto text-white text-[1rem] lg:text-[1.1rem] xl:text-[1.08rem] font-medium">
                      {HERO_CONTENT.statistics[1].label}
                    </div>
                  </div>
                  <div className="stat-box stat-box-4 rounded-sm overflow-hidden flex items-center justify-center">
                    <div className="worker-image">
                      <Image
                        src="/r-1.webp"
                        alt="Workers installing windows"
                        width={185}
                        height={185}
                        className="w-[185px] h-[190px] lg:w-[195px] lg:h-[230px] xl:h-[250px] object-cover rounded-sm object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
