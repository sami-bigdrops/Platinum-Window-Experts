'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FAQ_CONTENT } from '@/lib/constant'

export default function Faq(){
    const [openFaq, setOpenFaq] = useState<number | null>(1) 
    const [isClient, setIsClient] = useState(false)

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id)
    }

    useEffect(() => {
        setIsClient(true)
    }, [])

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
                        <div className='flex-shrink-0'>
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

                
                <div
                  className="contact-section w-full md:w-[45%] lg:w-[40%] xl:w-[35%] border-2 p-6 "
                  style={{
                    borderColor: "rgba(39,80,134,0.80)",
                    background: "#FBFBFC",
                  }}
                >
                  <div className='flex flex-col items-start justify-center gap-2 xl:gap-3'>
                    <h3 className='text-dark font-bold italic text-base md:text-xl lg:text-2xl xl:text-2xl font-montserrat'>
                      {FAQ_CONTENT.contactSection.heading}
                    </h3>
                    <p className='text-gray text-[0.85rem] md:text-[0.9rem]  xl:text-[1rem] font-roboto'>
                      {FAQ_CONTENT.contactSection.description}
                    </p>
                    {isClient && (
                      <button
                        className="flex flex-row items-center gap-2 mt-4 rounded-sm text-sm lg:text-base xl:text-lg px-4 lg:px-5 py-3 font-medium font-roboto cursor-pointer hover:bg-[#275086] bg-blue text-white transition-all duration-300"
                      >
                        <Image
                          src="/desktop.svg"
                          alt="Phone"
                          width={16}
                          height={16}
                          className="h-4 xl:h-5 w-auto"
                        />
                        <span className="text-sm lg:text-base xl:text-[1.2rem] font-roboto text-white">
                          1-855-659-1507
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}