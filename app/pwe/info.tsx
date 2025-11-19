import {  INFO_CONTENT } from '@/lib/constant'
import React from 'react'
import Image from 'next/image'

export default function Info() {
  return (
    <div
      className='info w-full h-full p-4 md:p-9  lg:py-13 lg:px-13 xl:p-10  xl:px-45 xl:py-15'
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

            <div className="cta-button w-full md:mt-2 xl:mt-4 max-w-[160px] lg:max-w-[180px] xl:max-w-[220px] flex items-center justify-center">
                <button className="bg-blue w-full text-white px-4 py-3 xl:py-4 text-[0.9rem] md:text-base lg:text-[1.1rem] xl:text-[1.2rem] rounded-sm font-medium font-roboto flex items-center justify-center gap-4 cursor-pointer hover:bg-[#275086] transition-colors">
                  {INFO_CONTENT.ctaButton}
                  
                </button>
            </div>


          </div>
          <div className="info-container w-full max-w-6xl mx-auto md:w-[50%]">
            <div className="relative w-full h-[280px] md:h-[200px] lg:h-[250px] xl:h-[300px] xl:w-[480px] overflow-hidden">
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
