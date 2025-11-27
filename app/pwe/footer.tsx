import React from 'react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-white p-6 md:px-6 lg:px-8 lg:pt-13 lg:pb-6 xl:px-45 xl:pb-5 xl:pt-15 " style={{ background: 'rgba(39, 80, 134, 1)' }}>
      <div className="container mx-auto">
        <div className="content flex flex-col-reverse items-center justify-center md:flex-row-reverse md:justify-between gap-5 ">
          
          
          <div className="footer-links flex flex-row items-center justify-center mb-1 gap-2 lg:gap-3 ">
            <a 
              href="/privacy-policy" 
              className="text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem] font-roboto font-medium lg:text-sm xl:text-base text-white hover:text-[#2B96E4] transition-colors duration-300"
              
            >
              Privacy Policy
            </a>
            <span className="text-white text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem]">|</span>
            <a 
              href="/terms-of-use" 
              className="text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem] font-roboto font-medium lg:text-sm xl:text-base text-white hover:text-[#2B96E4] transition-colors duration-300"
              
            >
               Terms of Service
            </a>
            <span className="text-white text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem]">|</span>
            <a 
              href="#" 
              className="text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem] font-roboto font-medium lg:text-sm xl:text-base text-white hover:text-[#2B96E4] transition-colors duration-300"
             
            >
              Unsubscribe
            </a>
          </div>
          
          <div className="copyright text-center 2xl:mb-2">
            <p className="text-[0.75rem] md:text-[0.8rem] lg:text-[0.95rem] xl:text-[1.1rem] font-roboto font-medium lg:text-sm xl:text-base text-color " >
              &copy; {currentYear}  PlatinumWindowExperts.com. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
