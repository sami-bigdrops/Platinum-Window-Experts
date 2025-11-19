import React from 'react'
import Image from 'next/image'
import { STEPS_CONTENT } from '@/lib/constant'

export default function Steps() {
  return (
    <div className='steps w-full h-full p-4 py-8 md:py-10 md:px-15 lg:py-10 lg:px-20 xl:p-12  xl:px-45 xl:pb-15' style={{ backgroundColor: '#F5F5F5' }}>
      <div className='container mx-auto'>
        <div className='content w-full flex flex-col items-center justify-center gap-8 md:gap-10 lg:gap-13'>
          <div className='title-container text-center flex flex-col items-center justify-center gap-4'>
            <div className='title'>
              <h2 className='title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem]  md:max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] font-bold font-montserrat text-center text-dark' style={{ lineHeight: 1.3 }}>
                {STEPS_CONTENT.heading}
                <span className='title-highlight heading-gradient inline-block'>
                  {STEPS_CONTENT.headingHighlight}
                </span>
              </h2>
            </div>
            <div className='description'>
              <p className='description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:max-w-[500px] lg:max-w-[650px] mx-auto font-roboto' style={{ lineHeight: 1.5 }}>
                {STEPS_CONTENT.description}
              </p>
            </div>
          </div>

          <div className='steps-container w-full max-w-4xl xl:max-w-7xl mx-auto relative'>
            {/* Vertical Timeline Line - centered in steps container */}
            <div className="timeline-line absolute left-[50.0%] md:left-[50.0%] 2xl:left-[48.0%] -translate-x-1/2 top-0 w-1 h-full border-dashed border-l-2 border-orange-500 z-10 height-[calc(89% + 60px)]" >
              {/* Top Circle */}
              <div className="absolute -top-2.5 -left-1.25 2xl:-top-3 2xl:-left-1.5 w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-orange rounded-full"></div>
              {/* Bottom Circle */}
              <div className="absolute -bottom-2.5 -left-1.25 2xl:-bottom-3 2xl:-left-1.5 w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-orange rounded-full"></div>
            </div>
        
            
            {/* Step Number Badges - positioned at center of each step item */}
            <div className="absolute left-[50.0%] md:left-[50.0%] 2xl:left-[48.0%] -translate-x-1/2 top-[11.5%] z-10">
              <div className='w-6 h-6 md:w-8 md:h-8 xl:w-11 xl:h-11 bg-orange rounded-[5px]  flex items-center justify-center'>
                <span className='text-white font-semibold text-[0.9rem] md:text-[1.0rem] xl:text-[1.35rem] font-montserrat'>01</span>
              </div>
            </div>
            
            <div className="absolute left-[50.0%] md:left-[50.0%] 2xl:left-[48.0%] -translate-x-1/2 top-[48.0%] lg:top-[47.0%]  z-10">
              <div className='w-6 h-6 md:w-8 md:h-8 xl:w-11 xl:h-11 bg-orange rounded-[5px]  flex items-center justify-center'>
                <span className='text-white font-semibold text-[0.9rem] md:text-[1.0rem] xl:text-[1.35rem] font-montserrat'>02</span>
              </div>
            </div>
            
            <div className="absolute left-[50.0%] md:left-[50.0%] 2xl:left-[48.0%] -translate-x-1/2 top-[83.5%] z-10">
              <div className='w-6 h-6 md:w-8 md:h-8 xl:w-11 xl:h-11 bg-orange rounded-[5px]  flex items-center justify-center'>
                <span className='text-white font-semibold text-[0.9rem] md:text-[1.0rem] xl:text-[1.35rem] font-montserrat'>03</span>
              </div>
            </div>

            {/* Steps */}
            <div className='steps-list w-full flex flex-col items-center justify-center gap-6 md:gap-10 lg:gap-13'>
                <div className='step-item w-full flex items-center justify-center gap-6'>
                    <div className='step-icon flex items-center justify-start w-[60%] md:w-[60%] '>
                        <Image src={STEPS_CONTENT.steps[0].image} alt={STEPS_CONTENT.steps[0].title} width={100} height={100}
                         className='w-[105px] h-[80px] md:w-[250px] md:h-[140px] lg:w-[325px] lg:h-[170px] xl:w-[400px] xl:h-[210px] object-cover' />
                    </div>
                    <div className='w-[40%] md:w-[40%] '>
                      <div className='step-content flex flex-col items-start justify-start gap-2 md:gap-3 xl:gap-4'>
                          <h3 className='text-[0.85rem] md:text-[1.05rem] lg:text-[1.2rem] xl:text-[24px] font-bold font-montserrat text-left text-dark' style={{ lineHeight: 1.3 }}>{STEPS_CONTENT.steps[0].title}</h3>
                          <p className='text-dark text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] lg:max-w-[300px] xl:max-w-[370px] xl:text-[18px] text-left font-normal md:max-w-full max-w-[105px] font-roboto' style={{ lineHeight: 1.6 }}>{STEPS_CONTENT.steps[0].description}</p>
                      </div>
                    </div>
                </div>

                <div className='step-item w-full flex flex-row-reverse items-center justify-center gap-6'>
                    <div className='step-icon flex items-center justify-start w-[40%] md:w-[40%]'>
                        <Image src={STEPS_CONTENT.steps[1].image} alt={STEPS_CONTENT.steps[1].title} width={100} height={100}
                         className='w-[105px] h-[80px] md:w-[250px] md:h-[140px] lg:w-[325px] lg:h-[170px] xl:w-[400px] xl:h-[210px] object-cover' />
                    </div>
                    <div className='w-[60%] md:w-[60%]'>
                      <div className='step-content flex flex-col items-start justify-start gap-2 md:gap-3 xl:gap-4'>
                          <h3 className='text-[0.85rem] max-w-[150px] md:text-[1.05rem] lg:text-[1.2rem] xl:text-[24px] font-bold font-montserrat text-left text-dark' style={{ lineHeight: 1.3 }}>{STEPS_CONTENT.steps[1].title}</h3>
                          <p className='text-dark text-[0.7rem] md:text-[0.8rem] text-left lg:text-[0.9rem] lg:max-w-[320px] xl:max-w-[420px] xl:text-[18px] font-normal md:max-w-[270px] max-w-[105px] font-roboto' style={{ lineHeight: 1.6 }}>{STEPS_CONTENT.steps[1].description}</p>
                      </div>
                    </div>
                </div>

                <div className='step-item w-full flex items-center justify-center gap-6'>
                    <div className='step-icon flex items-center justify-start w-[60%] md:w-[60%]'>
                        <Image src={STEPS_CONTENT.steps[2].image} alt={STEPS_CONTENT.steps[2].title} width={100} height={100}
                         className='w-[105px] h-[80px] md:w-[250px] md:h-[140px] lg:w-[325px] lg:h-[170px] xl:w-[400px] xl:h-[210px] object-cover' />
                    </div>
                    <div className='w-[40%] md:w-[40%]'>
                      <div className='step-content flex flex-col items-start justify-start gap-2 md:gap-3 xl:gap-4'>
                          <h3 className='text-[0.85rem] md:text-[1.05rem] lg:text-[1.2rem] xl:text-[24px] font-bold font-montserrat text-left text-dark' style={{ lineHeight: 1.3 }}>{STEPS_CONTENT.steps[2].title}</h3>
                          <p className='text-dark text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] lg:max-w-[320px] xl:max-w-[390px] xl:text-[18px] text-left font-normal md:max-w-full max-w-[105px] font-roboto' style={{ lineHeight: 1.6 }}>{STEPS_CONTENT.steps[2].description}</p>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}