import React from 'react'
import { HERO_CONTENT } from '@/lib/constant'
import Image from 'next/image'

export default function USA() {
  return (

      <div className="usa-section w-full h-full p-4 md:p-8 lg:px-10  xl:px-45 " style={{ background: '#F3F4F6' }}>
        <div className="container mx-auto">
          <div className="content">
            <div className="made-in-usa-section flex flex-col items-start justify-start gap-3">
              
                <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold text-dark font-montserrat">
                  {HERO_CONTENT.madeInUSA.heading}
                </h2>
                <p className="text-[0.9rem] lg:text-[0.93rem] xl:text-[1.1rem] md:max-w-[450px] lg:max-w-[490px] xl:max-w-[700px] text-gray font-normal  font-roboto leading-relaxed">
                  {HERO_CONTENT.madeInUSA.description}
                </p>
                {/* Certification */}
                <div className="flex items-center gap-4 w-full mt-3 ">
                  <Image
                    src={HERO_CONTENT.madeInUSA.certificationImage}
                    alt={HERO_CONTENT.madeInUSA.heading}
                    width={100}
                    height={10}
                    className="w-auto h-10 xl:h-12"
                  />
                </div>
                <div className="w-full h-[0.5px] md:max-w-[420px] lg:max-w-[560px] xl:max-w-[640px] bg-[#BBB] my-4" style={{ background: "#BBB"}}></div>
                {/* Features */}
                <div className="w-full md:max-w-[420px] lg:max-w-[560px] xl:max-w-[650px] grid grid-cols-1 sm:grid-cols-3  gap-3 md:gap-1">
                  {HERO_CONTENT.madeInUSA.features.map((feature, index) => (
                    <div key={index} className="flex md:items-center md:items-start gap-2">
                      <Image
                        src={feature.icon}
                        alt="Check"
                        width={20}
                        height={20}
                        className="w-6 h-5 xl:h-6 xl:w-7"
                      />
                      <span className="text-[0.85rem] md:text-[0.85rem] lg:text-[0.9rem] xl:text-[1rem] font-medium text-dark font-montserrat ">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              
            </div>
          </div>
        </div>
      </div>
    
  )
}