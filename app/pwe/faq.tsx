'use client'

import React, { useState } from 'react'
import { FAQ_CONTENT } from '@/lib/constant'

export default function Faq(){
    const [openFaq, setOpenFaq] = useState<number | null>(1) 

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id)
    }

    return (
        <div id="faq" className='faq w-full bg-white h-full p-4 md:py-8 lg:py-8 lg:px-8 xl:p-10 xl:px-25'>
          <div className='container mx-auto'>
            <div className='content w-full flex flex-col items-center justify-center gap-8 md:gap-10 lg:gap-13'>
              <div className='title-container text-center flex flex-col items-center justify-center gap-4'>
                <div className='title'>
                  <h2 className='title-text text-2xl md:text-3xl lg:text-4xl xl:text-[2.6rem]  md:max-w-[500px] lg:max-w-[650px] xl:max-w-[700px] font-bold font-montserrat text-center text-dark' style={{ lineHeight: 1.3 }}>
                    {FAQ_CONTENT.heading}
                    <span className='title-highlight heading-gradient inline-block'>
                      {FAQ_CONTENT.headingHighlight}
                    </span>
                  </h2>
                </div>
                <div className='description'>
                  <p className='description-text text-gray text-center text-sm md:text-sm lg:text-base xl:text-[1.15rem] md:max-w-[500px] lg:max-w-[650px] mx-auto font-roboto' style={{ lineHeight: 1.5 }}>
                    {FAQ_CONTENT.description}
                  </p>
                </div>
              </div>

              <div className='faq-container w-full flex flex-col items-center justify-center md:flex-row-reverse md:items-start gap-5 xl:gap-8 lg:max-w-4xl xl:max-w-6xl'>
                
                <div className='faq-questions md:w-[55%] lg:w-[60%] xl:w-[75%] flex flex-col items-center justify-center gap-5'>
                  {FAQ_CONTENT.faqs.map((faq) => (
                    <div key={faq.id} className='w-full bg-white border border-[#BBB] overflow-hidden'>
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className='w-full p-5  text-left flex items-center justify-between transition-colors'
                      >
                        <h3 className='text-dark font-semibold text-[15px]  max-w-[190px] md:max-w-[260px] md:text-base lg:text-[1.1rem] xl:text-[1.15rem] lg:max-w-full font-montserrat pr-4'>
                          {faq.question}
                        </h3>
                        <div className='shrink-0'>
                          <div className='w-8 h-8 bg-orange flex items-center justify-center rounded-[5px]'>
                            <svg
                              className='w-4 h-4 text-white transition-all duration-200'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                            >
                              {openFaq === faq.id ? (
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M4 12h16'
                                />
                              ) : (
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 4v16m8-8H4'
                                />
                              )}
                            </svg>
                          </div>
                        </div>
                      </button>
                      {openFaq === faq.id && (
                        <div className='px-6 pb-6'>
                          <p className='text-gray text-[0.88rem] md:text-[0.9rem] lg:text-[0.95rem] xl:text-[1rem] font-roboto leading-relaxed' style={{ lineHeight: 1.6 }}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}